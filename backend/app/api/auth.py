from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.auth import get_or_create_mock_user
from app.db.session import get_db
from app.schemas.auth import MockLoginRequest, MockLoginResponse
from app.schemas.response import SuccessResponse

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/mock-login", response_model=SuccessResponse[MockLoginResponse])
def mock_login(
    body: MockLoginRequest, db: Session = Depends(get_db)
) -> SuccessResponse[MockLoginResponse]:
    user = get_or_create_mock_user(db, body.role)
    data = MockLoginResponse(user_id=user.id, nickname=user.nickname, role=user.role)
    return SuccessResponse(data=data, message="Mock 로그인 되었습니다.")
