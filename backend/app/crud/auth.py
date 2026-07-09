from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
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

    # Check-then-insert is not atomic: two concurrent first-time mock-logins
    # (e.g. React StrictMode double-firing an effect, or two browser tabs
    # onboarding at once) can both pass the SELECT above before either
    # commits. Fall back to re-reading the row on a unique-constraint clash
    # instead of letting the second caller's request 500.
    try:
        user = User(nickname=nickname, email=email, role=role)
        db.add(user)
        db.flush()
        return user
    except IntegrityError:
        db.rollback()
        return db.execute(select(User).where(User.email == email)).scalar_one()
