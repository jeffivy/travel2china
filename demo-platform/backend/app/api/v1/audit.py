"""审计日志 API"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.api.deps import RequireAdmin
from app.models.user import User
from app.models.audit import AuditLog

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_audit_logs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    action: str = Query(default=None),
    user_id: str = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """审计日志列表"""
    query = db.query(AuditLog)

    if action:
        query = query.filter(AuditLog.action == action)
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)

    total = query.count()
    items = (
        query.order_by(AuditLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return APIResponse(
        data={
            "items": [i.to_dict() for i in items],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }
    )
