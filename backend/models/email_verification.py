from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from backend.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), index=True, nullable=False)

    # 인증코드는 원문 저장하지 않고 hash 저장
    code_hash = Column(String(255), nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    attempts = Column(Integer, nullable=False, default=0)
    max_attempts = Column(Integer, nullable=False, default=5)

    is_verified = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # 재요청 제한용
    last_sent_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)