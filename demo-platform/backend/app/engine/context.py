"""剧本执行上下文"""

from dataclasses import dataclass, field
from typing import Any
from datetime import datetime


@dataclass
class ExecutionContext:
    """单个剧本执行的全量上下文"""

    execution_id: str
    scenario_id: str
    topology_id: str
    speed_factor: float = 1.0  # slow=3.0, normal=1.0, fast=0.3
    defense_mode: str = "none"  # none / partial / full
    enabled_products: list[str] = field(default_factory=list)
    node_ips: dict[str, str] = field(default_factory=dict)  # node_id -> IP
    started_at: datetime = field(default_factory=datetime.utcnow)

    # 运行状态
    current_step_idx: int = 0
    total_steps: int = 0
    steps_succeeded: int = 0
    steps_blocked: int = 0
    steps_failed: int = 0

    def to_dict(self) -> dict:
        return {
            "execution_id": self.execution_id,
            "scenario_id": self.scenario_id,
            "defense_mode": self.defense_mode,
            "speed_factor": self.speed_factor,
            "current_step": self.current_step_idx,
            "total_steps": self.total_steps,
            "steps_succeeded": self.steps_succeeded,
            "steps_blocked": self.steps_blocked,
            "steps_failed": self.steps_failed,
            "progress_pct": round(self.current_step_idx / max(self.total_steps, 1) * 100, 1),
        }
