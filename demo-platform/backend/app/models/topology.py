"""拓扑模型"""

from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.database import Base
from app.models.user import gen_id


class Topology(Base):
    __tablename__ = "topology"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String(128), nullable=False)
    description = Column(Text, default="")
    template_id = Column(String(32), nullable=True)  # T-01 .. T-06
    background = Column(String(32), default="machine_room")
    nodes_json = Column(Text, nullable=False, default="[]")  # TopologyNode[] JSON
    edges_json = Column(Text, nullable=False, default="[]")  # TopologyEdge[] JSON
    defense_config_json = Column(Text, default="{}")
    created_by = Column(String, ForeignKey("user.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        import json
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "template_id": self.template_id,
            "background": self.background,
            "nodes": json.loads(self.nodes_json),
            "edges": json.loads(self.edges_json),
            "defense_config": json.loads(self.defense_config_json),
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
