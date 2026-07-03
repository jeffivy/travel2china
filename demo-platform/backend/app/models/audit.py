"""审计日志模型"""

from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey
from app.database import Base
from app.models.user import gen_id


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String, ForeignKey("user.id"), index=True, nullable=True)
    username = Column(String(64), default="")
    action = Column(String(64), nullable=False, index=True)
    resource_type = Column(String(32), nullable=True)
    resource_id = Column(String, nullable=True)
    detail = Column(JSON, nullable=True)
    ip = Column(String(45), nullable=True)
    user_agent = Column(String(256), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.username,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "detail": self.detail,
            "ip": self.ip,
            "user_agent": self.user_agent,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
