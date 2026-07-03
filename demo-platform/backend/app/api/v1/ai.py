"""AI 文本生成 API"""

import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.scenario import AiGenerateRequest
from app.api.deps import RequireAdmin
from app.models.user import User
from app.engine.mapping_validator import MappingValidator

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/scenario-from-text", response_model=APIResponse)
async def generate_scenario_from_text(
    req: AiGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(RequireAdmin),
):
    """AI 文本 → 剧本 JSON

    将自然语言描述的客户场景转换为结构化的 Scenario + Topology
    """
    # 简易版：基于关键词规则生成（不依赖 LLM API）
    # 完整版会调用 LLM API + 实体校验

    text_lower = req.text.lower()

    # 关键词识别
    detected = {
        "industry": "",
        "systems": [],
        "attacks": [],
        "defenses": [],
    }

    if "医院" in req.text or "his" in text_lower or "pacs" in text_lower:
        detected["industry"] = "hospital"
        detected["systems"] = ["防火墙", "HIS服务器", "PACS服务器", "数据库", "办公PC", "摄像头"]
        detected["attacks"] = ["ATT-001", "ATT-002", "ATT-025"]
        detected["defenses"] = ["DEF-020", "DEF-015", "DEF-023"]
    elif "制造" in req.text or "工控" in req.text or "mes" in text_lower:
        detected["industry"] = "factory"
        detected["systems"] = ["防火墙", "工业交换机", "MES服务器", "工控机", "摄像头", "办公PC"]
        detected["attacks"] = ["ATT-006", "ATT-013", "ATT-027"]
        detected["defenses"] = ["DEF-016", "DEF-007", "DEF-023"]
    elif "高校" in req.text or "校园" in req.text:
        detected["industry"] = "campus"
        detected["systems"] = ["防火墙", "核心交换机", "教学服务器", "办公PC", "WiFi AP"]
        detected["attacks"] = ["ATT-029", "ATT-019", "ATT-009"]
        detected["defenses"] = ["DEF-007", "DEF-008", "DEF-023"]
    elif "政府" in req.text or "办公" in req.text:
        detected["industry"] = "government"
        detected["systems"] = ["防火墙", "审计版", "OA服务器", "邮件服务器", "办公PC", "视频会议"]
        detected["attacks"] = ["ATT-025", "ATT-026", "ATT-001"]
        detected["defenses"] = ["DEF-008", "DEF-020", "DEF-023"]
    else:
        detected["industry"] = "internet"
        detected["systems"] = ["防火墙", "核心交换机", "Web服务器", "数据库", "办公PC"]
        detected["attacks"] = ["ATT-001", "ATT-009", "ATT-005"]
        detected["defenses"] = ["DEF-020", "DEF-001", "DEF-023"]

    # 加载节点类型字典
    from pathlib import Path
    from app.config import settings

    node_types_path = Path(settings.CONFIG_DIR) / "node-types.json"
    with open(node_types_path, encoding="utf-8") as f:
        node_types_data = json.load(f)

    node_type_map = {n["id"]: n for n in node_types_data.get("node_types", [])}

    # 生成拓扑节点
    nodes = []
    import uuid

    # 添加攻击机
    nodes.append(
        {
            "id": f"node-{str(uuid.uuid4())[:8]}",
            "type": "attacker",
            "label": "攻击机",
            "position": {"x": 50, "y": 300},
            "config": {},
            "vulnerabilities": [],
        }
    )

    # 根据识别的系统生成节点
    positions = [(300, 100), (300, 250), (300, 400), (550, 100), (550, 250), (550, 400)]
    for i, sys_name in enumerate(detected["systems"]):
        # 匹配节点类型
        node_type = "web-server"
        if "防火墙" in sys_name:
            node_type = "firewall-brain"
        elif "数据库" in sys_name:
            node_type = "db-server"
        elif "PC" in sys_name:
            node_type = "pc"
        elif "摄像头" in sys_name:
            node_type = "camera"
        elif "WiFi" in sys_name:
            node_type = "wifi-ap"
        elif "交换机" in sys_name:
            node_type = "switch"
        elif "审计" in sys_name:
            node_type = "audit-brain"

        pos = positions[i] if i < len(positions) else (300 + i * 250, 300)
        nodes.append(
            {
                "id": f"node-{str(uuid.uuid4())[:8]}",
                "type": node_type,
                "label": sys_name,
                "position": {"x": pos[0], "y": pos[1]},
                "config": {},
                "vulnerabilities": [],
            }
        )

    # 生成边
    edges = []
    for i in range(1, len(nodes)):
        edges.append(
            {
                "id": f"edge-{str(uuid.uuid4())[:8]}",
                "source_node_id": nodes[0]["id"],
                "target_node_id": nodes[i]["id"],
                "protocol": "tcp",
            }
        )

    # 生成攻击序列
    attack_sequence = []
    for i, att_id in enumerate(detected["attacks"]):
        from app.engine.registry import get_registry

        registry = get_registry()
        script_meta = dict(registry.attack_metas) if registry.attack_metas else {}

        attack_sequence.append(
            {
                "step_id": f"step-{i + 1}",
                "order": i + 1,
                "script_id": att_id,
                "target_node_id": nodes[min(i + 1, len(nodes) - 1)]["id"],
                "params": {},
                "wait_after_sec": 2,
                "continue_on_fail": False,
            }
        )

    # 生成防御快照
    defense_snapshot = {}
    for def_id in detected["defenses"]:
        # 查找对应的产品
        if def_id == "DEF-020":
            prod = "waf"
        elif def_id == "DEF-015":
            prod = "edr-server"
        elif def_id == "DEF-023":
            prod = "soc"
        elif def_id == "DEF-001":
            prod = "firewall-brain"
        elif def_id == "DEF-007":
            prod = "firewall-brain"
        elif def_id == "DEF-008":
            prod = "firewall-brain"
        elif def_id == "DEF-016":
            prod = "edr-server"
        else:
            prod = "waf"

        if prod not in defense_snapshot:
            defense_snapshot[prod] = {"enabled": True, "rules": {}}
        defense_snapshot[prod]["rules"][def_id] = {
            "enabled": True,
            "config": {},
        }

    # 实体校验
    validator = MappingValidator()
    scenario_draft = {"attack_sequence": attack_sequence, "defense_snapshot": defense_snapshot}
    issues = validator.validate_scenario(scenario_draft)

    result = {
        "topology": {
            "name": f"AI生成-{detected['industry']}拓扑",
            "description": f"根据 '{req.text[:50]}...' 自动生成",
            "nodes": nodes,
            "edges": edges,
            "background": "machine_room",
        },
        "scenario": {
            "name": f"AI生成-{detected['industry']}演示剧本",
            "description": req.text,
            "attack_sequence": attack_sequence,
            "defense_snapshot": defense_snapshot,
            "difficulty": "medium",
            "expected_duration_sec": len(attack_sequence) * 60,
        },
        "detected": detected,
        "validation_issues": issues,
        "warnings": issues,
    }

    # 如果 LLM API 配置了，尝试调用
    if settings.LLM_API_KEY:
        try:
            result = await _call_llm(req.text, result)
        except Exception as e:
            logger.warning(f"LLM 调用失败，使用规则生成结果: {e}")

    return APIResponse(data=result, message="AI 剧本生成完成")


async def _call_llm(text: str, fallback: dict) -> dict:
    """调用 LLM API 进行高级文本分析"""
    from openai import AsyncOpenAI
    from app.config import settings

    client = AsyncOpenAI(api_key=settings.LLM_API_KEY, base_url=settings.LLM_BASE_URL)

    prompt = f"""你是一个网络安全架构师。请根据以下客户描述，识别IT系统并推荐演示剧本。

客户描述：
{text}

请以 JSON 格式返回:
{{
  "industry": "行业类型",
  "systems": ["系统1", ...],
  "recommended_attacks": ["ATT-001", ...],
  "recommended_defenses": ["DEF-001", ...],
  "summary": "一句话总结"
}}
"""
    try:
        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
        )
        content = response.choices[0].message.content
        if content:
            llm_result = json.loads(content)
            fallback["llm_analysis"] = llm_result
            fallback["detected"]["industry"] = llm_result.get("industry", fallback["detected"]["industry"])
    except Exception:
        pass

    return fallback
