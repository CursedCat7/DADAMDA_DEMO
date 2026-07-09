from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enums import UserRole
from app.models.user import User

_MOCK_USERS: dict[UserRole, tuple[str, str]] = {
    UserRole.USER: ("김민수", "demo-user@dadamda.local"),
    UserRole.MERCHANT: ("박영희", "demo-merchant@dadamda.local"),
    UserRole.ADMIN: ("관리자", "demo-admin@dadamda.local"),
}


def get_or_create_mock_user(db: Session, role: UserRole) -> User:
    nickname, email = _MOCK_USERS[role]

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user is not None:
        return user

    user = User(nickname=nickname, email=email, role=role)
    db.add(user)
    db.flush()
    return user
