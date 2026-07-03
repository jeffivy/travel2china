"""执行管理 API"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.scenario import DefenseModeRequest
from app.services.scenario_service import ScenarioService
from app.models.execution import ScenarioExecution, StepExecution
from app.api.deps import get_current_user, RequireOperator
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_executions(
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """执行历史列表"""
    items = ScenarioService.list_executions(db, limit)
    return APIResponse(data=[e.to_dict() for e in items])


@router.get("/{execution_id}", response_model=APIResponse)
async def get_execution(
    execution_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """单次执行详情"""
    execution = ScenarioService.get_execution(db, execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="执行记录不存在")
    return APIResponse(data=execution.to_dict())


@router.get("/{execution_id}/steps", response_model=APIResponse)
async def get_execution_steps(
    execution_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """执行步骤列表"""
    steps = (
        db.query(StepExecution)
        .filter(StepExecution.execution_id == execution_id)
        .order_by(StepExecution.order_num)
        .all()
    )
    return APIResponse(data=[s.to_dict() for s in steps])


@router.post("/{execution_id}/defense-mode", response_model=APIResponse)
async def switch_defense_mode(
    execution_id: str,
    req: DefenseModeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(RequireOperator),
):
    """切换防御模式"""
    execution = ScenarioService.get_execution(db, execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="执行记录不存在")

    execution.defense_mode = req.mode
    db.commit()
    logger.info(f"防御模式切换: {execution_id} -> {req.mode}")
    return APIResponse(
        data={"execution_id": execution_id, "defense_mode": req.mode},
        message=f"防御模式已切换为: {req.mode}",
    )


@router.get("/{execution_id}/alerts", response_model=APIResponse)
async def get_execution_alerts(
    execution_id: str,
    severity: str = Query(default=None),
    limit: int = Query(default=50, le=500),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """获取执行关联的告警"""
    from app.models.alert import Alert

    query = db.query(Alert).filter(Alert.execution_id == execution_id)
    if severity:
        query = query.filter(Alert.severity == severity)
    alerts = query.order_by(Alert.created_at.desc()).limit(limit).all()
    return APIResponse(data=[a.to_dict() for a in alerts])


@router.get("/{execution_id}/packets", response_model=APIResponse)
async def get_execution_packets(
    execution_id: str,
    limit: int = Query(default=100, le=1000),
    offset: int = Query(default=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """获取执行关联的流量包"""
    from app.models.packet import Packet

    total = db.query(Packet).filter(Packet.execution_id == execution_id).count()
    packets = (
        db.query(Packet)
        .filter(Packet.execution_id == execution_id)
        .order_by(Packet.captured_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return APIResponse(
        data={
            "items": [p.to_dict() for p in packets],
            "total": total,
            "offset": offset,
            "limit": limit,
        }
    )
