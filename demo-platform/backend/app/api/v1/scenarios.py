"""剧本管理 API"""

import threading
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.schemas.common import APIResponse
from app.schemas.scenario import ScenarioCreate, ScenarioUpdate, ScenarioStartRequest, DefenseModeRequest
from app.services.scenario_service import ScenarioService
from app.api.deps import get_current_user, RequireAdmin, RequireOperator
from app.models.user import User
import logging

logger = logging.getLogger(__name__)


def _run_scenario_background(execution_id: str):
    """在后台线程中执行剧本（不依赖 Celery）"""
    import asyncio
    db = SessionLocal()
    try:
        from app.services.attack_engine import AttackEngine
        engine = AttackEngine()
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(engine.run_scenario(execution_id, db))
        finally:
            loop.close()
    except Exception as exc:
        logger.error(f"后台执行失败: {execution_id} - {exc}", exc_info=True)
        try:
            from app.models.execution import ScenarioExecution
            import json
            execution = db.query(ScenarioExecution).filter(ScenarioExecution.id == execution_id).first()
            if execution:
                execution.status = "failed"
                execution.result_json = json.dumps({"error": str(exc)})
                db.commit()
        except Exception:
            pass
    finally:
        db.close()

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_scenarios(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """剧本列表"""
    items = ScenarioService.list_all(db)
    return APIResponse(data=[s.to_dict() for s in items])


@router.get("/{scenario_id}", response_model=APIResponse)
async def get_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """剧本详情"""
    scenario = ScenarioService.get_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="剧本不存在")
    return APIResponse(data=scenario.to_dict())


@router.post("", response_model=APIResponse, status_code=201)
async def create_scenario(
    req: ScenarioCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """创建剧本"""
    # 校验拓扑存在
    if req.topology_id:
        from app.services.topology_service import TopologyService
        if not TopologyService.get_by_id(db, req.topology_id):
            raise HTTPException(status_code=400, detail="关联的拓扑不存在")

    scenario = ScenarioService.create(db, req.model_dump(), user.id)
    return APIResponse(data=scenario.to_dict(), message="剧本创建成功")


@router.put("/{scenario_id}", response_model=APIResponse)
async def update_scenario(
    scenario_id: str,
    req: ScenarioUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """更新剧本"""
    scenario = ScenarioService.update(db, scenario_id, req.model_dump(exclude_none=True))
    if not scenario:
        raise HTTPException(status_code=404, detail="剧本不存在")
    return APIResponse(data=scenario.to_dict(), message="剧本更新成功")


@router.delete("/{scenario_id}", response_model=APIResponse)
async def delete_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """删除剧本"""
    success = ScenarioService.delete(db, scenario_id)
    if not success:
        raise HTTPException(status_code=404, detail="剧本不存在")
    return APIResponse(message="剧本已删除")


@router.post("/{scenario_id}/duplicate", response_model=APIResponse)
async def duplicate_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """复制剧本"""
    new_scenario = ScenarioService.duplicate(db, scenario_id, user.id)
    if not new_scenario:
        raise HTTPException(status_code=404, detail="原剧本不存在")
    return APIResponse(data=new_scenario.to_dict(), message="剧本已复制")


@router.post("/{scenario_id}/start", response_model=APIResponse)
async def start_scenario(
    scenario_id: str,
    req: ScenarioStartRequest,
    db: Session = Depends(get_db),
    user: User = Depends(RequireOperator),
):
    """启动剧本执行"""
    scenario = ScenarioService.get_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="剧本不存在")

    execution = ScenarioService.create_execution(db, scenario_id, user.id, req.speed)

    # 在后台线程中执行（不阻塞 HTTP 响应）
    thread = threading.Thread(
        target=_run_scenario_background,
        args=(execution.id,),
        daemon=True,
        name=f"scenario-{execution.id[:8]}",
    )
    thread.start()
    logger.info(f"剧本已启动（后台线程）: {execution.id}")

    return APIResponse(
        data={"execution_id": execution.id, "status": "started"},
        message="剧本已启动",
    )


@router.post("/{scenario_id}/stop", response_model=APIResponse)
async def stop_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireOperator),
):
    """停止剧本执行"""
    # 查找最近的执行
    execution = (
        db.query(ScenarioExecution)
        .filter(
            ScenarioExecution.scenario_id == scenario_id,
            ScenarioExecution.status == "running",
        )
        .first()
    )
    if not execution:
        raise HTTPException(status_code=404, detail="没有正在运行的执行")

    execution.status = "stopped"
    db.commit()
    return APIResponse(message="剧本已停止")


@router.get("/{scenario_id}/status", response_model=APIResponse)
async def get_scenario_status(
    scenario_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """获取剧本最新执行状态"""
    execution = (
        db.query(ScenarioExecution)
        .filter(ScenarioExecution.scenario_id == scenario_id)
        .order_by(ScenarioExecution.created_at.desc())
        .first()
    )
    if not execution:
        return APIResponse(data={"status": "never_executed"})
    return APIResponse(data=execution.to_dict())
