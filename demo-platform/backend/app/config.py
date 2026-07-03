"""应用配置管理"""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # 数据库
    DB_PATH: str = "/app/data/data.db"

    # JWT
    JWT_SECRET: str = "demo-platform-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 2

    # 日志
    LOG_LEVEL: str = "INFO"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # LLM
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o"

    # 默认管理员
    DEFAULT_ADMIN_USER: str = "admin"
    DEFAULT_ADMIN_PASS: str = "Demo@2026"

    # 文件路径
    CONFIG_DIR: str = "/app/config"
    DATA_DIR: str = "/app/data"
    PCAP_DIR: str = "/app/pcap"

    # 演示
    GUEST_MODE: bool = True
    MAX_FAILED_LOGIN: int = 5
    LOCKOUT_MINUTES: int = 10
    AUDIT_RETENTION_DAYS: int = 90

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# 确保目录存在
Path(settings.DATA_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.PCAP_DIR).mkdir(parents=True, exist_ok=True)
