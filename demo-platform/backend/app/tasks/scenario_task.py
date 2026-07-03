"""剧本执行 Celery 任务"""

import asyncio
import logging
from app.tasks.celery_app import celery_app
from app.services.attack_engine import AttackEngine
from app.database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="execute_scenario")
def execute_scenario(self, execution_id: str):
    """异步执行剧本（Celery worker 调用）"""
    logger.info(f"Celery 任务启动: execution_id={execution_id}")

    db = SessionLocal()
    try:
        engine = AttackEngine()

        # 在 Celery worker 中运行异步引擎
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            loop.run_until_complete(engine.run_scenario(execution_id, db))
        finally:
            loop.close()

        logger.info(f"Celery 任务完成: execution_id={execution_id}")
        return {"status": "success", "execution_id": execution_id}

    except Exception as e:
        logger.error(f"Celery 任务失败: {execution_id} - {e}", exc_info=True)
        # 更新执行状态为失败
        from app.models.execution import ScenarioExecution
        execution = db.query(ScenarioExecution).filter(ScenarioExecution.id == execution_id).first()
        if execution:
            execution.status = "failed"
            import json
            execution.result_json = json.dumps({"error": str(e)})
            db.commit()
        raise
    finally:
        db.close()
