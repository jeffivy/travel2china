"""拓扑管理服务"""

import json
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.topology import Topology
import logging

logger = logging.getLogger(__name__)


class TopologyService:
    """拓扑 CRUD 服务"""

    @staticmethod
    def list_all(db: Session) -> List[Topology]:
        return db.query(Topology).order_by(Topology.updated_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, topo_id: str) -> Optional[Topology]:
        return db.query(Topology).filter(Topology.id == topo_id).first()

    @staticmethod
    def create(db: Session, data: dict, user_id: str) -> Topology:
        topo = Topology(
            name=data["name"],
            description=data.get("description", ""),
            template_id=data.get("template_id"),
            background=data.get("background", "machine_room"),
            nodes_json=json.dumps(data.get("nodes", [])),
            edges_json=json.dumps(data.get("edges", [])),
            defense_config_json=json.dumps(data.get("defense_config", {})),
            created_by=user_id,
        )
        db.add(topo)
        db.commit()
        db.refresh(topo)
        logger.info(f"拓扑已创建: {topo.name} ({topo.id})")
        return topo

    @staticmethod
    def update(db: Session, topo_id: str, data: dict) -> Optional[Topology]:
        topo = TopologyService.get_by_id(db, topo_id)
        if not topo:
            return None

        for key in ("name", "description", "background", "template_id"):
            if key in data:
                setattr(topo, key, data[key])

        if "nodes" in data:
            topo.nodes_json = json.dumps(data["nodes"])
        if "edges" in data:
            topo.edges_json = json.dumps(data["edges"])
        if "defense_config" in data:
            topo.defense_config_json = json.dumps(data["defense_config"])

        db.commit()
        db.refresh(topo)
        logger.info(f"拓扑已更新: {topo.name}")
        return topo

    @staticmethod
    def delete(db: Session, topo_id: str) -> bool:
        topo = TopologyService.get_by_id(db, topo_id)
        if not topo:
            return False
        db.delete(topo)
        db.commit()
        logger.info(f"拓扑已删除: {topo_id}")
        return True

    @staticmethod
    async def deploy(db: Session, topo_id: str) -> dict:
        """部署拓扑到仿真网络（简化版：返回节点配置，实际由 DockerService 处理）"""
        topo = TopologyService.get_by_id(db, topo_id)
        if not topo:
            raise ValueError("拓扑不存在")

        topo_dict = topo.to_dict()
        # 简化版：不实际操作 Docker，返回部署计划
        plan = {
            "topology_id": topo_id,
            "nodes_count": len(topo_dict["nodes"]),
            "edges_count": len(topo_dict["edges"]),
            "network": "simnet (172.20.0.0/24)",
            "status": "deployed",
            "nodes": [
                {
                    "id": n["id"],
                    "type": n["type"],
                    "label": n["label"],
                    "container_name": f"demo-node-{n['id'][:8]}",
                    "ip": f"172.20.0.{100 + idx}",
                }
                for idx, n in enumerate(topo_dict["nodes"])
            ],
        }
        logger.info(f"拓扑部署计划: {topo.name} ({len(plan['nodes'])} 节点)")
        return plan

    @staticmethod
    def load_template(template_id: str) -> Optional[dict]:
        """加载预置拓扑模板"""
        import json
        from pathlib import Path
        from app.config import settings

        path = Path(settings.CONFIG_DIR) / "topology-templates" / f"{template_id}.json"
        if path.exists():
            with open(path, encoding="utf-8") as f:
                return json.load(f)
        return None
