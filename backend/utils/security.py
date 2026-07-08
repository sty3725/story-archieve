import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# =========================
# Password Hash
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# Code / Token Hash
# =========================

def hash_token(token: str) -> str:
    secret = settings.SECRET_KEY.encode("utf-8")
    message = token.encode("utf-8")

    return hmac.new(
        secret,
        message,
        hashlib.sha256,
    ).hexdigest()


def verify_token(plain_token: str, hashed_token: str) -> bool:
    plain_token_hash = hash_token(plain_token)

    return hmac.compare_digest(plain_token_hash, hashed_token)


# =========================
# JWT
# =========================

def create_access_token(
    subject: str,
    expires_delta: timedelta | None = None,
    extra_data: dict[str, Any] | None = None,
) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = utc_now() + expires_delta

    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
    }

    if extra_data:
        payload.update(extra_data)

    encoded_jwt = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return encoded_jwt


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None