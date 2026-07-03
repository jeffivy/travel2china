"""剧本相关 Schema"""

from pydantic import BaseModel, Field


class AttackStep(BaseModel):
    step_id: str
    order: int
    script_id: str
    target_node_id: str = ""
    params: dict = {}
    wait_after_sec: int = 2
    continue_on_fail: bool = False


class ScenarioCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    description: str = ""
    topology_id: str | None = None
    attack_sequence: list[dict] = []
    defense_snapshot: dict = {}
    expected_duration_sec: int = 180
    difficulty: str = "medium"
    tags: list[str] = []


class ScenarioUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=128)
    description: str | None = None
    topology_id: str | None = None
    attack_sequence: list[dict] | None = None
    defense_snapshot: dict | None = None
    expected_duration_sec: int | None = None
    difficulty: str | None = None
    tags: list[str] | None = None


class ScenarioStartRequest(BaseModel):
    speed: str = Field(default="normal", pattern="^(slow|normal|fast)$")


class DefenseModeRequest(BaseModel):
    mode: str = Field(..., pattern="^(none|partial|full)$")
    enabled_products: list[str] = []


class AiGenerateRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=5000)
    template_id: str | None = None
    auto_create_topology: bool = True
