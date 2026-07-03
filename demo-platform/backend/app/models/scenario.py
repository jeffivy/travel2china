"""剧本模型"""

from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, Boolean, ForeignKey
from app.database import Base
from app.models.user import gen_id


class Scenario(Base):
    __tablename__ = "scenario"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String(128), nullable=False)
    description = Column(Text, default="")
    topology_id = Column(String, ForeignKey("topology.id"), nullable=True)
    attack_sequence_json = Column(Text, nullable=False, default="[]")  # AttackStep[] JSON
    defense_snapshot_json = Column(Text, default="{}")
    expected_duration_sec = Column(Integer, default=180)
    difficulty = Column(String(16), default="medium")  # easy / medium / hard
    tags = Column(String(256), default="")
    is_preset = Column(Boolean, default=False)
    created_by = Column(String, ForeignKey("user.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        import json
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "topology_id": self.topology_id,
            "attack_sequence": json.loads(self.attack_sequence_json),
            "defense_snapshot": json.loads(self.defense_snapshot_json),
            "expected_duration_sec": self.expected_duration_sec,
            "difficulty": self.difficulty,
            "tags": self.tags.split(",") if self.tags else [],
            "is_preset": self.is_preset,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
