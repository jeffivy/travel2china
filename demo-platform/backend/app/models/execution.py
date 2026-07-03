"""剧本执行模型"""

from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from app.database import Base
from app.models.user import gen_id


class ScenarioExecution(Base):
    __tablename__ = "scenario_execution"

    id = Column(String, primary_key=True, default=gen_id)
    scenario_id = Column(String, ForeignKey("scenario.id"), nullable=False, index=True)
    topology_id = Column(String, ForeignKey("topology.id"), nullable=True)
    operator_id = Column(String, ForeignKey("user.id"), nullable=True)
    status = Column(String(16), default="pending", index=True)
    # pending / running / success / failed / stopped
    speed = Column(String(16), default="normal")  # slow / normal / fast
    defense_mode = Column(String(16), default="none")  # none / partial / full
    result_json = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        import json
        return {
            "id": self.id,
            "scenario_id": self.scenario_id,
            "topology_id": self.topology_id,
            "operator_id": self.operator_id,
            "status": self.status,
            "speed": self.speed,
            "defense_mode": self.defense_mode,
            "result": json.loads(self.result_json) if self.result_json else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class StepExecution(Base):
    __tablename__ = "step_execution"

    id = Column(String, primary_key=True, default=gen_id)
    execution_id = Column(String, ForeignKey("scenario_execution.id"), nullable=False, index=True)
    step_id = Column(String, nullable=False)
    order_num = Column(Integer, nullable=False)
    script_id = Column(String(32), nullable=False)
    target_node_id = Column(String, nullable=True)
    status = Column(String(16), default="pending")  # pending / running / success / failed / blocked / error
    result_json = Column(Text, nullable=True)
    error_msg = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)

    def to_dict(self) -> dict:
        import json
        return {
            "id": self.id,
            "execution_id": self.execution_id,
            "step_id": self.step_id,
            "order_num": self.order_num,
            "script_id": self.script_id,
            "target_node_id": self.target_node_id,
            "status": self.status,
            "result": json.loads(self.result_json) if self.result_json else None,
            "error_msg": self.error_msg,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
        }
