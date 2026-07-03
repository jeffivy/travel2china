"""v1 API 路由聚合"""

from fastapi import APIRouter
from app.api.v1 import auth, config, topologies, scenarios, executions, users, audit, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(config.router, prefix="/config", tags=["配置"])
api_router.include_router(topologies.router, prefix="/topologies", tags=["拓扑"])
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["剧本"])
api_router.include_router(executions.router, prefix="/executions", tags=["执行"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(audit.router, prefix="/audit-logs", tags=["审计"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI生成"])
