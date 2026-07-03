"""认证相关 Schema"""

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=1, max_length=128)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class TokenRefreshRequest(BaseModel):
    token: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UserCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default="guest", pattern="^(admin|operator|guest)$")
    display_name: str = Field(default="", max_length=64)


class UserUpdate(BaseModel):
    role: str | None = Field(default=None, pattern="^(admin|operator|guest)$")
    display_name: str | None = Field(default=None, max_length=64)
    is_active: bool | None = None
