"""流量包模型"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from app.database import Base
from app.models.user import gen_id


class Packet(Base):
    __tablename__ = "packet"

    id = Column(String, primary_key=True, default=gen_id)
    execution_id = Column(String, ForeignKey("scenario_execution.id"), index=True)
    src_ip = Column(String(45), index=True)
    dst_ip = Column(String(45), index=True)
    src_port = Column(Integer, default=0)
    dst_port = Column(Integer, default=0, index=True)
    protocol = Column(String(16), index=True)
    length = Column(Integer, default=0)
    flags = Column(String(32), nullable=True)
    payload_preview = Column(String(256), nullable=True)
    attack_script_id = Column(String(32), index=True, nullable=True)
    is_blocked = Column(Boolean, default=False, index=True)
    blocked_by = Column(String(32), nullable=True)
    blocked_rule_id = Column(String(32), nullable=True)
    captured_at = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "execution_id": self.execution_id,
            "src_ip": self.src_ip,
            "dst_ip": self.dst_ip,
            "src_port": self.src_port,
            "dst_port": self.dst_port,
            "protocol": self.protocol,
            "length": self.length,
            "flags": self.flags,
            "payload_preview": self.payload_preview,
            "attack_script_id": self.attack_script_id,
            "is_blocked": self.is_blocked,
            "blocked_by": self.blocked_by,
            "blocked_rule_id": self.blocked_rule_id,
            "captured_at": self.captured_at.isoformat() if self.captured_at else None,
        }
