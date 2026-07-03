"""攻击-防御映射校验器（需求文档第 10.3 节实现）"""

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class MappingValidator:
    """
    校验剧本中的攻击-防御映射是否合规

    使用方法:
        validator = MappingValidator()
        issues = validator.validate_scenario(scenario_dict)
        if issues:
            print(f"发现 {len(issues)} 个问题: {issues}")
    """

    def __init__(self, mapping_path: str = ""):
        if not mapping_path:
            mapping_path = str(Path(__file__).parent.parent.parent.parent / "config" / "attack-defense-mapping.json")

        with open(mapping_path, encoding="utf-8") as f:
            self.mapping = json.load(f)

        self.attack_map: dict[str, dict] = {}
        for m in self.mapping.get("mappings", []):
            self.attack_map[m["attack_id"]] = m

        logger.info(f"映射校验器就绪: {len(self.attack_map)} 条映射规则")

    def validate_scenario(self, scenario: dict) -> list[str]:
        """
        校验剧本的攻击-防御映射是否合规

        参数:
            scenario: 剧本字典 {attack_sequence: [...], defense_snapshot: {...}}

        返回:
            issues: 问题列表（空列表表示通过）
        """
        issues: list[str] = []
        defense_enabled: dict[str, Any] = scenario.get("defense_snapshot", {})

        for step in scenario.get("attack_sequence", []):
            attack_id = step.get("script_id", "")
            if not attack_id:
                continue

            if attack_id not in self.attack_map:
                issues.append(f"⚠ 未知的攻击脚本 ID: {attack_id}（未在映射表中定义）")
                continue

            mapping = self.attack_map[attack_id]
            primary = mapping.get("primary_defender", {})

            # 检查主防御产品的规则是否启用
            primary_product = primary.get("product_id", "")
            if not defense_enabled.get(primary_product, {}):
                # 主防御未启用是合法的（无防御演示模式）
                continue

            product_defense = defense_enabled.get(primary_product, {})
            if not product_defense.get("enabled", False):
                continue

            # 主防御已启用，检查关键规则
            rules = product_defense.get("rules", {})
            for rule_id in primary.get("rule_ids", []):
                if not rules.get(rule_id, {}):
                    issues.append(
                        f"⚠ {attack_id} ({mapping['attack_name']}): "
                        f"启用了 {primary['product_name']} 但未配置规则 {rule_id}"
                    )
                elif not rules.get(rule_id, {}).get("enabled", False):
                    issues.append(
                        f"⚠ {attack_id} ({mapping['attack_name']}): "
                        f"{primary['product_name']} 规则 {rule_id} 已配置但未启用"
                    )

        return issues

    def get_recommended_defense(self, attack_id: str) -> dict | None:
        """根据攻击 ID 推荐防御配置"""
        return self.attack_map.get(attack_id)

    def validate_attack_script(self, script_meta: dict) -> list[str]:
        """校验单个攻击脚本的元数据是否符合映射表"""
        issues = []
        attack_id = script_meta.get("id", "")
        expected = self.attack_map.get(attack_id)

        if not expected:
            return [f"攻击脚本 {attack_id} 未在映射表中定义"]

        # 校验目标节点
        actual_targets = set(script_meta.get("target_node_types", []))
        expected_targets = set(expected.get("target_node_types", []))
        if "any" in expected_targets:
            pass  # 允许任意目标
        elif not actual_targets.issubset(expected_targets):
            issues.append(f"{attack_id}: target_node_types 超出映射表范围")

        # 校验 blockable_by
        expected_blockers = {expected["primary_defender"]["product_id"]}
        for sec in expected.get("secondary_defenders", []):
            expected_blockers.add(sec["product_id"])
        actual_blockers = set(script_meta.get("blockable_by", []))
        if not expected_blockers.issubset(actual_blockers):
            issues.append(f"{attack_id}: blockable_by 缺失: {expected_blockers - actual_blockers}")

        return issues
