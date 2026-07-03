"""用户管理 API"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.auth import UserCreate, UserUpdate
from app.services.auth_service import AuthService
from app.api.deps import get_current_user, RequireAdmin
from app.models.user import User

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_users(
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """用户列表"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return APIResponse(data=[u.to_dict() for u in users])


@router.post("", response_model=APIResponse, status_code=201)
async def create_user(
    req: UserCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """创建用户"""
    existing = AuthService.get_user_by_username(db, req.username)
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")

    new_user = AuthService.create_user(
        db, username=req.username, password=req.password, role=req.role, display_name=req.display_name
    )
    return APIResponse(data=new_user.to_dict(), message="用户创建成功")


@router.put("/{user_id}", response_model=APIResponse)
async def update_user(
    user_id: str,
    req: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """更新用户"""
    target = AuthService.get_user_by_id(db, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")

    for field in ("role", "display_name", "is_active"):
        val = getattr(req, field, None)
        if val is not None:
            setattr(target, field, val)

    db.commit()
    return APIResponse(data=target.to_dict(), message="用户更新成功")


@router.delete("/{user_id}", response_model=APIResponse)
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """删除用户"""
    target = AuthService.get_user_by_id(db, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")

    if target.role == "admin":
        admin_count = db.query(User).filter(User.role == "admin", User.is_active == True).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="不能删除最后一个管理员")

    db.delete(target)
    db.commit()
    return APIResponse(message="用户已删除")


@router.post("/{user_id}/reset-password", response_model=APIResponse)
async def reset_password(
    user_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """重置密码"""
    target = AuthService.get_user_by_id(db, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")

    new_pass = "Demo@2026"
    target.password_hash = AuthService.hash_password(new_pass)
    db.commit()
    return APIResponse(data={"new_password": new_pass}, message="密码已重置为默认密码")
