"""拓扑管理 API"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.topology import TopologyCreate, TopologyUpdate
from app.services.topology_service import TopologyService
from app.api.deps import get_current_user, RequireAdmin, RequireOperator
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_topologies(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """拓扑列表"""
    items = TopologyService.list_all(db)
    return APIResponse(data=[t.to_dict() for t in items])


@router.get("/{topology_id}", response_model=APIResponse)
async def get_topology(
    topology_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """拓扑详情"""
    topo = TopologyService.get_by_id(db, topology_id)
    if not topo:
        raise HTTPException(status_code=404, detail="拓扑不存在")
    return APIResponse(data=topo.to_dict())


@router.post("", response_model=APIResponse, status_code=201)
async def create_topology(
    req: TopologyCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """创建拓扑"""
    topo = TopologyService.create(db, req.model_dump(), user.id)
    return APIResponse(data=topo.to_dict(), message="拓扑创建成功")


@router.put("/{topology_id}", response_model=APIResponse)
async def update_topology(
    topology_id: str,
    req: TopologyUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """更新拓扑"""
    topo = TopologyService.update(db, topology_id, req.model_dump(exclude_none=True))
    if not topo:
        raise HTTPException(status_code=404, detail="拓扑不存在")
    return APIResponse(data=topo.to_dict(), message="拓扑更新成功")


@router.delete("/{topology_id}", response_model=APIResponse)
async def delete_topology(
    topology_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """删除拓扑"""
    success = TopologyService.delete(db, topology_id)
    if not success:
        raise HTTPException(status_code=404, detail="拓扑不存在")
    return APIResponse(message="拓扑已删除")


@router.post("/{topology_id}/deploy", response_model=APIResponse)
async def deploy_topology(
    topology_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireOperator),
):
    """部署拓扑到仿真网络"""
    result = await TopologyService.deploy(db, topology_id)
    return APIResponse(data=result, message="拓扑已部署")
