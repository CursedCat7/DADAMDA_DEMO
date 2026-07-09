import uuid

from pydantic import BaseModel

from app.models.enums import UserRole


class MockLoginRequest(BaseModel):
    role: UserRole = UserRole.USER


class MockLoginResponse(BaseModel):
    user_id: uuid.UUID
    nickname: str
    role: UserRole
