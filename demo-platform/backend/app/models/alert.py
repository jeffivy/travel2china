"""告警模型"""

from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, ForeignKey
from app.database import Base
from app.models.user import gen_id


class Alert(Base):
    __tablename__ = "alert"

    id = Column(String, primary_key=True, default=gen_id)
    execution_id = Column(String, ForeignKey("scenario_execution.id"), index=True)
    step_execution_id = Column(String, ForeignKey("step_execution.id"), nullable=True)
    product = Column(String(32), nullable=False, index=True)
    rule_id = Column(String(32), nullable=True)
    attack_script_id = Column(String(32), nullable=True)
    severity = Column(String(16), nullable=False, index=True)  # low / medium / high / critical
    source_node_id = Column(String, nullable=True)
    target_node_id = Column(String, nullable=True)
    src_ip = Column(String(45), nullable=True)
    dst_ip = Column(String(45), nullable=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, default="")
    raw_evidence = Column(JSON, nullable=True)
    status = Column(String(16), default="new", index=True)  # new / handled / ignored
    handled_by = Column(String, ForeignKey("user.id"), nullable=True)
    handled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "execution_id": self.execution_id,
            "step_execution_id": self.step_execution_id,
            "product": self.product,
            "rule_id": self.rule_id,
            "attack_script_id": self.attack_script_id,
            "severity": self.severity,
            "source_node_id": self.source_node_id,
            "target_node_id": self.target_node_id,
            "src_ip": self.src_ip,
            "dst_ip": self.dst_ip,
            "title": self.title,
            "description": self.description,
            "raw_evidence": self.raw_evidence,
            "status": self.status,
            "handled_by": self.handled_by,
            "handled_at": self.handled_at.isoformat() if self.handled_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
