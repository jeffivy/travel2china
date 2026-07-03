"""FastAPI 应用入口"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from app.config import settings
from app.database import init_db
from app.api.v1.router import api_router
from app.engine.registry import ScriptRegistry

# 日志配置
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    # 启动时
    logger.info("=" * 50)
    logger.info("🚀 网络安全模拟演示平台 启动中...")
    logger.info("=" * 50)

    # 初始化数据库
    init_db()
    logger.info("✅ 数据库初始化完成")

    # 注册攻击脚本和防御规则
    registry = ScriptRegistry()
    registry.discover_all()
    logger.info(f"✅ 脚本注册完成: {registry.stats()}")

    # 创建默认管理员
    from app.services.auth_service import AuthService
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        AuthService.ensure_admin(db)
    finally:
        db.close()
    logger.info("✅ 默认管理员就绪")

    logger.info(f"📡 API 文档: http://localhost:8000/docs")
    logger.info(f"📡 ReDoc: http://localhost:8000/redoc")

    yield

    # 关闭时
    logger.info("👋 平台关闭")


app = FastAPI(
    title="网络安全模拟演示平台",
    description="轻量化网络安全攻防模拟演示系统",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json",
)

# CORS - 开发环境宽松，生产环境收紧
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """添加请求 ID 和计时"""
    import uuid
    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id

    start = time.time()
    response = await call_next(request)
    process_time = time.time() - start

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{process_time:.3f}s"
    return response


@app.get("/api/v1/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    }


# 注册 v1 路由
app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    logger.error(f"未处理异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "code": 5000,
            "message": "服务内部错误",
            "detail": str(exc) if settings.LOG_LEVEL == "DEBUG" else None,
            "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        },
    )
