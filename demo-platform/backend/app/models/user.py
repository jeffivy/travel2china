"""用户模型"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from app.database import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "user"

    id = Column(String, primary_key=True, default=gen_id)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(String(256), nullable=False)
    role = Column(String(16), nullable=False, default="guest")  # admin / operator / guest
    display_name = Column(String(64), default="")
    email = Column(String(128), default="")
    is_active = Column(Boolean, default=True)
    last_login_at = Column(DateTime, nullable=True)
    failed_login_count = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "display_name": self.display_name,
            "email": self.email,
            "is_active": self.is_active,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def is_locked(self) -> bool:
        if self.locked_until and self.locked_until > datetime.utcnow():
            return True
        return False
