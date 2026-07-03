"""初始化种子数据：管理员 + 预置拓扑 + 预置剧本"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.database import init_db, SessionLocal
from app.services.auth_service import AuthService
from app.services.topology_service import TopologyService
from app.services.scenario_service import ScenarioService
from app.config import settings
from pathlib import Path
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def init_admin():
    db = SessionLocal()
    try:
        AuthService.ensure_admin(db)
        logger.info("✅ 管理员账号就绪")
    finally:
        db.close()


def load_topology_templates():
    """加载预置拓扑模板"""
    db = SessionLocal()
    try:
        # 创建 demo 管理员用户（如果不存在）
        admin = AuthService.get_user_by_username(db, settings.DEFAULT_ADMIN_USER)
        if not admin:
            admin = AuthService.create_user(db, settings.DEFAULT_ADMIN_USER, settings.DEFAULT_ADMIN_PASS, "admin", "管理员")

        templates_dir = Path(settings.CONFIG_DIR) / "topology-templates"
        if not templates_dir.exists():
            logger.warning(f"拓扑模板目录不存在: {templates_dir}")
            return

        for tmpl_file in sorted(templates_dir.glob("*.json")):
            with open(tmpl_file, encoding="utf-8") as f:
                template = json.load(f)

            # 检查是否已存在
            from app.models.topology import Topology
            existing = db.query(Topology).filter(Topology.template_id == template.get("id")).first()
            if existing:
                logger.info(f"  跳过已存在的模板: {template.get('name')}")
                continue

            topo = TopologyService.create(
                db,
                {
                    "name": template.get("name", tmpl_file.stem),
                    "description": template.get("description", ""),
                    "template_id": template.get("id"),
                    "background": template.get("background", "machine_room"),
                    "nodes": template.get("nodes", []),
                    "edges": template.get("edges", []),
                    "defense_config": template.get("defense_config", {}),
                },
                admin.id,
            )
            logger.info(f"  ✅ 导入拓扑模板: {topo.name}")
    finally:
        db.close()


def load_scenario_presets():
    """加载预置剧本"""
    db = SessionLocal()
    try:
        admin = AuthService.get_user_by_username(db, settings.DEFAULT_ADMIN_USER)
        if not admin:
            logger.warning("管理员不存在，跳过导入剧本")
            return

        presets_dir = Path(settings.CONFIG_DIR) / "scenario-presets"
        if not presets_dir.exists():
            logger.warning(f"剧本预设目录不存在: {presets_dir}")
            return

        for preset_file in sorted(presets_dir.glob("*.json")):
            with open(preset_file, encoding="utf-8") as f:
                preset = json.load(f)

            from app.models.scenario import Scenario
            existing = db.query(Scenario).filter(Scenario.name == preset.get("name")).first()
            if existing:
                logger.info(f"  跳过已存在的剧本: {preset.get('name')}")
                continue

            # 关联一个拓扑
            from app.models.topology import Topology
            topo = db.query(Topology).first()
            if not topo:
                logger.warning("没有可用的拓扑模板，跳过")
                continue

            scenario = ScenarioService.create(
                db,
                {
                    "name": preset.get("name", preset_file.stem),
                    "description": preset.get("description", ""),
                    "topology_id": topo.id,
                    "attack_sequence": preset.get("attack_sequence", []),
                    "defense_snapshot": preset.get("defense_snapshot", {}),
                    "expected_duration_sec": preset.get("expected_duration_sec", 180),
                    "difficulty": preset.get("difficulty", "medium"),
                    "tags": preset.get("tags", []),
                },
                admin.id,
            )
            # 标记为预置
            scenario.is_preset = True
            db.commit()
            logger.info(f"  ✅ 导入预置剧本: {scenario.name}")
    finally:
        db.close()


def main():
    logger.info("=" * 50)
    logger.info("初始化平台数据...")
    logger.info("=" * 50)

    init_db()
    logger.info("✅ 数据库表创建完成")

    init_admin()
    load_topology_templates()
    load_scenario_presets()

    logger.info("=" * 50)
    logger.info("✅ 平台数据初始化完成!")
    logger.info(f"默认登录: {settings.DEFAULT_ADMIN_USER} / {settings.DEFAULT_ADMIN_PASS}")
    logger.info("=" * 50)


if __name__ == "__main__":
    main()
