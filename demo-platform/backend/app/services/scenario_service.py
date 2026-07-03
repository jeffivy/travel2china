"""剧本管理服务"""

import json
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.scenario import Scenario
from app.models.execution import ScenarioExecution
import logging

logger = logging.getLogger(__name__)


class ScenarioService:
    """剧本 CRUD + 执行服务"""

    @staticmethod
    def list_all(db: Session) -> List[Scenario]:
        return db.query(Scenario).order_by(Scenario.updated_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, scenario_id: str) -> Optional[Scenario]:
        return db.query(Scenario).filter(Scenario.id == scenario_id).first()

    @staticmethod
    def create(db: Session, data: dict, user_id: str) -> Scenario:
        scenario = Scenario(
            name=data["name"],
            description=data.get("description", ""),
            topology_id=data.get("topology_id"),
            attack_sequence_json=json.dumps(data.get("attack_sequence", [])),
            defense_snapshot_json=json.dumps(data.get("defense_snapshot", {})),
            expected_duration_sec=data.get("expected_duration_sec", 180),
            difficulty=data.get("difficulty", "medium"),
            tags=",".join(data.get("tags", [])),
            created_by=user_id,
        )
        db.add(scenario)
        db.commit()
        db.refresh(scenario)
        logger.info(f"剧本已创建: {scenario.name} ({scenario.id})")
        return scenario

    @staticmethod
    def update(db: Session, scenario_id: str, data: dict) -> Optional[Scenario]:
        scenario = ScenarioService.get_by_id(db, scenario_id)
        if not scenario:
            return None

        for key in ("name", "description", "topology_id", "expected_duration_sec", "difficulty"):
            if key in data:
                setattr(scenario, key, data[key])

        if "attack_sequence" in data:
            scenario.attack_sequence_json = json.dumps(data["attack_sequence"])
        if "defense_snapshot" in data:
            scenario.defense_snapshot_json = json.dumps(data["defense_snapshot"])
        if "tags" in data:
            scenario.tags = ",".join(data["tags"])

        db.commit()
        db.refresh(scenario)
        logger.info(f"剧本已更新: {scenario.name}")
        return scenario

    @staticmethod
    def delete(db: Session, scenario_id: str) -> bool:
        scenario = ScenarioService.get_by_id(db, scenario_id)
        if not scenario:
            return False
        db.delete(scenario)
        db.commit()
        return True

    @staticmethod
    def duplicate(db: Session, scenario_id: str, user_id: str) -> Optional[Scenario]:
        """复制剧本"""
        original = ScenarioService.get_by_id(db, scenario_id)
        if not original:
            return None
        data = original.to_dict()
        data["name"] = f"{data['name']} (副本)"
        return ScenarioService.create(db, data, user_id)

    @staticmethod
    def create_execution(db: Session, scenario_id: str, user_id: str, speed: str = "normal") -> ScenarioExecution:
        execution = ScenarioExecution(
            scenario_id=scenario_id,
            operator_id=user_id,
            status="pending",
            speed=speed,
        )
        db.add(execution)
        db.commit()
        db.refresh(execution)
        return execution

    @staticmethod
    def get_execution(db: Session, execution_id: str) -> Optional[ScenarioExecution]:
        return db.query(ScenarioExecution).filter(ScenarioExecution.id == execution_id).first()

    @staticmethod
    def list_executions(db: Session, limit: int = 20) -> List[ScenarioExecution]:
        return (
            db.query(ScenarioExecution)
            .order_by(ScenarioExecution.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def load_preset(scenario_id: str) -> Optional[dict]:
        """加载预置剧本"""
        from pathlib import Path
        from app.config import settings

        path = Path(settings.CONFIG_DIR) / "scenario-presets" / f"{scenario_id}.json"
        if path.exists():
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        return None
