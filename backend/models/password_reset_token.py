from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from backend.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # 재설정 코드 또는 토큰은 원문 저장하지 않고 hash 저장
    token_hash = Column(String(255), nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    attempts = Column(Integer, nullable=False, default=0)
    max_attempts = Column(Integer, nullable=False, default=5)

    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    used_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship(
        "User",
        back_populates="password_reset_tokens",
    )