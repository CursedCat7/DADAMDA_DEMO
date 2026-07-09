import uuid

from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User


def get_current_user_id(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> uuid.UUID:
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="X-User-Id header is required")

    try:
        user_id = uuid.UUID(x_user_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="X-User-Id must be a valid UUID") from exc

    if db.execute(select(User.id).where(User.id == user_id)).first() is None:
        raise HTTPException(status_code=401, detail="Unknown user")

    return user_id


def get_current_merchant_id(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> uuid.UUID:
    role = db.execute(select(User.role).where(User.id == user_id)).scalar_one()
    if role != UserRole.MERCHANT:
        raise HTTPException(status_code=403, detail="Merchant role required")
    return user_id
