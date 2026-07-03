"""统一响应模型"""

from typing import Any, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid


def gen_request_id() -> str:
    return str(uuid.uuid4())[:8]


class APIResponse(BaseModel):
    code: int = 0
    message: str = "success"
    data: Any = None
    timestamp: str = datetime.utcnow().isoformat() + "Z"
    request_id: str = ""

    model_config = {"from_attributes": True}


class PaginatedData(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int


class ErrorResponse(BaseModel):
    code: int
    message: str
    detail: Optional[str] = None
    timestamp: str = datetime.utcnow().isoformat() + "Z"
    request_id: str = ""
