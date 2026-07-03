"""认证 API"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, TokenRefreshRequest, ChangePasswordRequest
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/login", response_model=APIResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    user, error = AuthService.authenticate(db, req.username, req.password)
    if error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error)

    token = AuthService.create_token(user.id, user.username, user.role)

    return APIResponse(
        data=LoginResponse(
            access_token=token,
            token_type="bearer",
            user=user.to_dict(),
        ).model_dump(),
    )


@router.post("/logout", response_model=APIResponse)
async def logout(user: User = Depends(get_current_user)):
    """登出（客户端丢弃 Token）"""
    return APIResponse(message="已登出")


@router.get("/me", response_model=APIResponse)
async def get_me(user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return APIResponse(data=user.to_dict())


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(req: TokenRefreshRequest, db: Session = Depends(get_db)):
    """刷新 Token"""
    payload = AuthService.decode_token(req.token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 无效")

    user = AuthService.get_user_by_id(db, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")

    new_token = AuthService.create_token(user.id, user.username, user.role)
    return APIResponse(data={"access_token": new_token, "token_type": "bearer"})


@router.post("/change-password", response_model=APIResponse)
async def change_password(
    req: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """修改密码"""
    if not AuthService.verify_password(req.old_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="原密码错误")

    user.password_hash = AuthService.hash_password(req.new_password)
    db.commit()
    return APIResponse(message="密码已修改")
