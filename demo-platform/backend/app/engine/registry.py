"""脚本注册中心 — 自动发现攻击脚本和防御规则"""

import importlib
import pkgutil
import logging
from typing import Any

logger = logging.getLogger(__name__)


class ScriptRegistry:
    """攻击脚本与防御规则的注册中心"""

    def __init__(self):
        self.attack_modules: dict[str, Any] = {}  # script_id -> module
        self.attack_metas: list[tuple[str, dict]] = []  # (script_id, meta)
        self.defense_modules: dict[str, Any] = {}  # rule_id -> module
        self.defense_metas: list[tuple[str, dict]] = []  # (rule_id, meta)

    def discover_attacks(self):
        """扫描 attacks 目录，自动注册所有攻击脚本"""
        try:
            from app.scripts import attacks as attack_pkg
        except ImportError:
            logger.warning("攻击脚本包未找到")
            return

        for _, name, _ in pkgutil.iter_modules(attack_pkg.__path__, f"{attack_pkg.__name__}."):
            try:
                module = importlib.import_module(name)
                if hasattr(module, "SCRIPT_META"):
                    meta = module.SCRIPT_META
                    script_id = meta.get("id", name)
                    self.attack_modules[script_id] = module
                    self.attack_metas.append((script_id, meta))
                    logger.debug(f"  注册攻击脚本: {script_id} - {meta.get('name', '?')}")
            except Exception as e:
                logger.error(f"加载攻击脚本失败 {name}: {e}")

        logger.info(f"已加载 {len(self.attack_modules)} 个攻击脚本")

    def discover_defenses(self):
        """扫描 defenses 目录，自动注册所有防御规则"""
        try:
            from app.scripts import defenses as defense_pkg
        except ImportError:
            logger.warning("防御规则包未找到")
            return

        for _, name, _ in pkgutil.iter_modules(defense_pkg.__path__, f"{defense_pkg.__name__}."):
            try:
                module = importlib.import_module(name)
                if hasattr(module, "RULE_META"):
                    meta = module.RULE_META
                    rule_id = meta.get("id", name)
                    self.defense_modules[rule_id] = module
                    self.defense_metas.append((rule_id, meta))
                    logger.debug(f"  注册防御规则: {rule_id} - {meta.get('name', '?')}")
            except Exception as e:
                logger.error(f"加载防御规则失败 {name}: {e}")

        logger.info(f"已加载 {len(self.defense_modules)} 个防御规则")

    def discover_all(self):
        """发现所有脚本"""
        self.discover_attacks()
        self.discover_defenses()

    def get_attack(self, script_id: str) -> Any | None:
        return self.attack_modules.get(script_id)

    def get_defense(self, rule_id: str) -> Any | None:
        return self.defense_modules.get(rule_id)

    def stats(self) -> dict:
        return {
            "attacks": len(self.attack_modules),
            "defenses": len(self.defense_modules),
        }


# 全局单例
_registry: ScriptRegistry | None = None


def get_registry() -> ScriptRegistry:
    global _registry
    if _registry is None:
        _registry = ScriptRegistry()
        _registry.discover_all()
    return _registry
