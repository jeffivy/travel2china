"""拓扑相关 Schema"""

from pydantic import BaseModel, Field
from typing import Any


class TopologyNode(BaseModel):
    id: str
    type: str
    label: str
    position: dict = {"x": 0, "y": 0}
    config: dict = {}
    vulnerabilities: list[str] = []


class TopologyEdge(BaseModel):
    id: str
    source_node_id: str
    target_node_id: str
    source_port: str | None = None
    target_port: str | None = None
    protocol: str | None = "tcp"
    label: str | None = None


class TopologyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    description: str = ""
    template_id: str | None = None
    background: str = "machine_room"
    nodes: list[dict] = []
    edges: list[dict] = []
    defense_config: dict = {}


class TopologyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=128)
    description: str | None = None
    background: str | None = None
    nodes: list[dict] | None = None
    edges: list[dict] | None = None
    defense_config: dict | None = None


class TopologyDeployRequest(BaseModel):
    topology_id: str
