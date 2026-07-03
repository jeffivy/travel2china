"""配置查询 API（静态资源读取）"""

import json
from pathlib import Path
from fastapi import APIRouter, Depends
from app.schemas.common import APIResponse
from app.api.deps import get_current_user
from app.config import settings

router = APIRouter()

CONFIG_DIR = Path(settings.CONFIG_DIR)


def _load_json(filename: str) -> dict:
    path = CONFIG_DIR / filename
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


@router.get("/node-types", response_model=APIResponse)
async def get_node_types(user=Depends(get_current_user)):
    """获取节点类型字典"""
    data = _load_json("node-types.json")
    return APIResponse(data=data.get("node_types", []))


@router.get("/attack-scripts", response_model=APIResponse)
async def get_attack_scripts(user=Depends(get_current_user)):
    """获取所有攻击脚本元数据"""
    from app.engine.registry import ScriptRegistry
    registry = ScriptRegistry()
    registry.discover_attacks()
    return APIResponse(data=[m for _, m in registry.attack_metas])


@router.get("/defense-rules", response_model=APIResponse)
async def get_defense_rules(user=Depends(get_current_user)):
    """获取所有防御规则元数据"""
    from app.engine.registry import ScriptRegistry
    registry = ScriptRegistry()
    registry.discover_defenses()
    return APIResponse(data=[m for _, m in registry.defense_metas])


@router.get("/topology-templates", response_model=APIResponse)
async def get_topology_templates(user=Depends(get_current_user)):
    """获取预置拓扑模板"""
    templates_dir = CONFIG_DIR / "topology-templates"
    templates = []
    if templates_dir.exists():
        for f in sorted(templates_dir.glob("*.json")):
            with open(f, encoding="utf-8") as fp:
                templates.append(json.load(fp))
    return APIResponse(data=templates)


@router.get("/mapping", response_model=APIResponse)
async def get_attack_defense_mapping(user=Depends(get_current_user)):
    """获取攻击-防御映射表"""
    data = _load_json("attack-defense-mapping.json")
    return APIResponse(data=data)
