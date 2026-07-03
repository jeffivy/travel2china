"""防御引擎检查器 — 检查请求是否被防御规则拦截"""

import logging
from typing import Any
from app.engine.registry import get_registry

logger = logging.getLogger(__name__)


class DefenseEngine:
    """模拟防御节点行为：遍历所有启用的防御规则，检查请求是否被匹配"""

    def __init__(self):
        self.registry = get_registry()

    async def check_request(self, request_data: dict, defense_config: dict) -> dict:
        """
        检查一个请求是否被防御规则拦截

        参数:
            request_data: {
                "method": "POST", "url": "...", "body": "...",
                "src_ip": "...", "dst_ip": "...", "script_id": "ATT-001"
            }
            defense_config: {
                "waf": {"enabled": true, "rules": {"DEF-020": {"enabled": true, "config": {...}}}},
                ...
            }

        返回:
            {
                "is_blocked": bool,
                "blocked_by": [{"product": "waf", "rule_id": "DEF-020", "match_detail": {...}}],
                "alerts": [{"severity": "high", "product": "waf", "description": "..."}]
            }
        """
        if not defense_config:
            return {"is_blocked": False, "blocked_by": [], "alerts": []}

        blocked_by: list[dict] = []
        alerts: list[dict] = []

        for product_id, product_config in defense_config.items():
            if not isinstance(product_config, dict):
                continue
            if not product_config.get("enabled", False):
                continue

            rules = product_config.get("rules", {})
            if not rules:
                continue

            for rule_id, rule_config in rules.items():
                if not isinstance(rule_config, dict):
                    continue
                if not rule_config.get("enabled", False):
                    continue

                rule_config_params = rule_config.get("config", {})

                # 获取防御规则模块并执行检查
                defense_module = self.registry.get_defense(rule_id)
                if not defense_module:
                    continue

                try:
                    match = defense_module.check(request_data, rule_config_params)
                    if match:
                        blocked_by.append(
                            {
                                "product": product_id,
                                "rule_id": rule_id,
                                "match_detail": match,
                            }
                        )
                        alerts.append(
                            {
                                "severity": match.get("severity", "high"),
                                "alert_type": match.get("alert_type", "unknown"),
                                "product": product_id,
                                "rule_id": rule_id,
                                "source_ip": request_data.get("src_ip", ""),
                                "target_ip": request_data.get("dst_ip", ""),
                                "description": match.get("description", f"规则 {rule_id} 命中"),
                            }
                        )
                except Exception as e:
                    logger.error(f"防御规则 {rule_id} 执行异常: {e}")

        return {
            "is_blocked": len(blocked_by) > 0,
            "blocked_by": blocked_by,
            "alerts": alerts,
        }
