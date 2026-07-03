"""攻击引擎调度器 — 负责剧本步骤的串行执行"""

import json
import asyncio
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.engine.registry import get_registry
from app.engine.executor import ScriptExecutor
from app.engine.context import ExecutionContext
from app.services.defense_engine import DefenseEngine

logger = logging.getLogger(__name__)

SPEED_FACTORS = {"slow": 3.0, "normal": 1.0, "fast": 0.3}


class AttackEngine:
    """攻击引擎：调度攻击脚本按剧本步骤执行"""

    def __init__(self):
        self.registry = get_registry()
        self.defense_engine = DefenseEngine()

    def run_scenario_sync(self, execution_id: str, db: Session):
        """同步执行剧本（Celery 不可用时的降级方案）"""
        import asyncio
        loop = asyncio.new_event_loop()
        try:
            loop.run_until_complete(self.run_scenario(execution_id, db))
        finally:
            loop.close()

    async def run_scenario(self, execution_id: str, db: Session | None = None):
        """异步执行整个剧本"""
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            from app.models.execution import ScenarioExecution, StepExecution

            execution = db.query(ScenarioExecution).filter(ScenarioExecution.id == execution_id).first()
            if not execution:
                logger.error(f"执行记录不存在: {execution_id}")
                return

            from app.models.scenario import Scenario

            scenario = db.query(Scenario).filter(Scenario.id == execution.scenario_id).first()
            if not scenario:
                logger.error(f"剧本不存在: {execution.scenario_id}")
                return

            steps = json.loads(scenario.attack_sequence_json)
            defense_snapshot = json.loads(scenario.defense_snapshot_json)

            speed_factor = SPEED_FACTORS.get(execution.speed, 1.0)

            # 更新执行状态
            execution.status = "running"
            execution.started_at = datetime.utcnow()
            db.commit()

            ctx = ExecutionContext(
                execution_id=execution_id,
                scenario_id=scenario.id,
                topology_id=scenario.topology_id or "",
                speed_factor=speed_factor,
                defense_mode=execution.defense_mode,
                total_steps=len(steps),
            )

            logger.info(f"▶ 开始执行剧本: {scenario.name} ({execution_id}), {len(steps)} 步骤")

            for idx, step in enumerate(steps):
                ctx.current_step_idx = idx + 1

                step_id = step.get("step_id", f"step-{idx + 1}")
                script_id = step.get("script_id", "")
                target_node_id = step.get("target_node_id", "")
                params = step.get("params", {})
                wait_after = step.get("wait_after_sec", 2)

                # 创建步骤记录
                step_exec = StepExecution(
                    execution_id=execution_id,
                    step_id=step_id,
                    order_num=idx + 1,
                    script_id=script_id,
                    target_node_id=target_node_id,
                    status="running",
                    started_at=datetime.utcnow(),
                )
                db.add(step_exec)
                db.commit()

                logger.info(f"  📍 步骤 {idx + 1}/{len(steps)}: {script_id}")

                # 1) 检查防御规则
                attack_module = self.registry.get_attack(script_id)
                if not attack_module:
                    step_exec.status = "error"
                    step_exec.error_msg = f"攻击脚本不存在: {script_id}"
                    step_exec.ended_at = datetime.utcnow()
                    db.commit()
                    logger.warning(f"    ⚠ 脚本不存在: {script_id}")
                    ctx.steps_failed += 1
                    continue

                script_meta = getattr(attack_module, "SCRIPT_META", {})

                # 构造请求数据供防御引擎检查
                request_data = {
                    "method": "POST",
                    "url": f"http://{target_node_id}/{script_id}",
                    "body": json.dumps(params),
                    "src_ip": "172.20.0.99",
                    "dst_ip": target_node_id,
                    "script_id": script_id,
                    "headers": {},
                }

                defense_result = await self.defense_engine.check_request(request_data, defense_snapshot)

                if defense_result.get("is_blocked"):
                    # 攻击被拦截
                    step_exec.status = "blocked"
                    step_exec.result_json = json.dumps(
                        {"status": "blocked", "blocked_by": defense_result["blocked_by"], "logs": ["[🛡] 攻击已被防御系统拦截"]}
                    )
                    step_exec.ended_at = datetime.utcnow()
                    db.commit()

                    ctx.steps_blocked += 1

                    # 创建告警
                    for alert_data in defense_result.get("alerts", []):
                        self._create_alert(db, execution_id, step_exec.id, alert_data, script_id)

                    logger.info(f"    🛡 已拦截: {defense_result['blocked_by']}")
                else:
                    # 执行攻击
                    target_url = f"http://{target_node_id}:80"
                    result = await ScriptExecutor.run_attack(
                        attack_module, target_url, params, {"execution_id": execution_id, "step_id": step_id}
                    )

                    step_exec.status = result.get("status", "error")
                    step_exec.result_json = json.dumps(result)
                    step_exec.ended_at = datetime.utcnow()
                    db.commit()

                    if result.get("status") == "success":
                        ctx.steps_succeeded += 1
                        logger.info(f"    ✅ 攻击成功")
                    elif result.get("status") == "failed":
                        ctx.steps_failed += 1
                        logger.info(f"    ❌ 攻击失败")

            # 完成执行
            execution.status = "success"
            execution.ended_at = datetime.utcnow()
            execution.result_json = json.dumps(ctx.to_dict())
            db.commit()

            logger.info(f"✅ 剧本执行完成: {ctx.to_dict()}")

        except Exception as e:
            logger.error(f"剧本执行失败: {e}", exc_info=True)
            if "execution" in locals():
                execution.status = "failed"
                execution.result_json = json.dumps({"error": str(e)})
                db.commit()
        finally:
            if close_db:
                db.close()

    def _create_alert(self, db: Session, execution_id: str, step_exec_id: str, alert_data: dict, script_id: str):
        """创建告警记录"""
        from app.models.alert import Alert

        alert = Alert(
            execution_id=execution_id,
            step_execution_id=step_exec_id,
            product=alert_data.get("product", "unknown"),
            rule_id=alert_data.get("rule_id", ""),
            attack_script_id=script_id,
            severity=alert_data.get("severity", "medium"),
            title=alert_data.get("description", "未知告警"),
            description=alert_data.get("description", ""),
            source_node_id="attacker",
            target_node_id=alert_data.get("target_ip", ""),
            src_ip=alert_data.get("source_ip", ""),
            dst_ip=alert_data.get("target_ip", ""),
            status="new",
        )
        db.add(alert)
        db.commit()
