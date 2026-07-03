"""认证服务"""

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """认证与鉴权服务"""

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_token(user_id: str, username: str, role: str) -> str:
        """创建 JWT Token"""
        now = datetime.utcnow()
        payload = {
            "sub": user_id,
            "username": username,
            "role": role,
            "iat": now,
            "exp": now + timedelta(hours=settings.JWT_EXPIRY_HOURS),
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        """解码 JWT Token"""
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except JWTError:
            return None

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def authenticate(db: Session, username: str, password: str) -> tuple[Optional[User], Optional[str]]:
        """
        认证用户
        返回: (user, error_message)
        """
        user = AuthService.get_user_by_username(db, username)

        if not user:
            return None, "用户名或密码错误"

        if not user.is_active:
            return None, "账号已被禁用"

        if user.is_locked():
            return None, f"账号已被锁定，请{settings.LOCKOUT_MINUTES}分钟后重试"

        if not AuthService.verify_password(password, user.password_hash):
            # 记录失败
            user.failed_login_count += 1
            if user.failed_login_count >= settings.MAX_FAILED_LOGIN:
                user.locked_until = datetime.utcnow() + timedelta(minutes=settings.LOCKOUT_MINUTES)
                logger.warning(f"用户 {username} 已锁定")
            db.commit()
            return None, "用户名或密码错误"

        # 登录成功，重置计数
        user.failed_login_count = 0
        user.locked_until = None
        user.last_login_at = datetime.utcnow()
        db.commit()

        return user, None

    @staticmethod
    def create_user(
        db: Session, username: str, password: str, role: str = "guest", display_name: str = ""
    ) -> User:
        """创建用户"""
        user = User(
            username=username,
            password_hash=AuthService.hash_password(password),
            role=role,
            display_name=display_name or username,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"创建用户: {username} (role={role})")
        return user

    @staticmethod
    def ensure_admin(db: Session):
        """确保管理员账号存在"""
        admin = AuthService.get_user_by_username(db, settings.DEFAULT_ADMIN_USER)
        if not admin:
            AuthService.create_user(
                db,
                username=settings.DEFAULT_ADMIN_USER,
                password=settings.DEFAULT_ADMIN_PASS,
                role="admin",
                display_name="管理员",
            )
            logger.info(f"默认管理员已创建: {settings.DEFAULT_ADMIN_USER}")
