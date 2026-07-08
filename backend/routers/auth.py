from datetime import timedelta
import random

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.models.email_verification import EmailVerification
from backend.models.password_reset_token import PasswordResetToken
from backend.schemas.auth import (
    SendCodeRequest,
    VerifyCodeRequest,
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserMeResponse,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
    MessageResponse,
)
from backend.utils.security import (
    utc_now,
    hash_password,
    verify_password,
    hash_token,
    verify_token,
    create_access_token,
    decode_access_token,
)
from backend.config import settings


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def generate_6_digit_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_latest_email_verification(
    db: Session,
    email: str,
) -> EmailVerification | None:
    return (
        db.query(EmailVerification)
        .filter(EmailVerification.email == email)
        .order_by(desc(EmailVerification.created_at))
        .first()
    )


def get_latest_password_reset_token(
    db: Session,
    user_id: int,
) -> PasswordResetToken | None:
    return (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.user_id == user_id)
        .order_by(desc(PasswordResetToken.created_at))
        .first()
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 정보가 유효하지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 정보가 유효하지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.post("/send-code", response_model=MessageResponse)
def send_code(
    request: SendCodeRequest,
    db: Session = Depends(get_db),
):
    existing_user = get_user_by_email(db, request.email)

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 가입된 이메일입니다.",
        )

    latest_verification = get_latest_email_verification(db, request.email)

    if latest_verification is not None:
        seconds_since_last_send = (
            utc_now() - latest_verification.last_sent_at
        ).total_seconds()

        if seconds_since_last_send < settings.AUTH_CODE_RESEND_SECONDS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="인증코드는 잠시 후 다시 요청할 수 있습니다.",
            )

    code = generate_6_digit_code()

    verification = EmailVerification(
        email=request.email,
        code_hash=hash_token(code),
        expires_at=utc_now() + timedelta(minutes=settings.EMAIL_CODE_EXPIRE_MINUTES),
        attempts=0,
        max_attempts=settings.MAX_AUTH_ATTEMPTS,
        is_verified=False,
        last_sent_at=utc_now(),
    )

    db.add(verification)
    db.commit()

    # 1차 개발용: 실제 이메일 대신 콘솔 출력
    print(f"[EMAIL VERIFICATION CODE] {request.email}: {code}")

    return MessageResponse(message="인증코드를 발송했습니다.")


@router.post("/verify-code", response_model=MessageResponse)
def verify_code(
    request: VerifyCodeRequest,
    db: Session = Depends(get_db),
):
    verification = get_latest_email_verification(db, request.email)

    if verification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="인증코드 요청 내역이 없습니다.",
        )

    if verification.is_verified:
        return MessageResponse(message="이미 인증된 이메일입니다.")

    if verification.expires_at < utc_now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증코드가 만료되었습니다.",
        )

    if verification.attempts >= verification.max_attempts:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="인증 시도 횟수를 초과했습니다.",
        )

    verification.attempts += 1

    if not verify_token(request.code, verification.code_hash):
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="인증코드가 올바르지 않습니다.",
        )

    verification.is_verified = True
    verification.verified_at = utc_now()

    db.commit()

    return MessageResponse(message="이메일 인증이 완료되었습니다.")


@router.post("/register", response_model=UserMeResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_email_user = get_user_by_email(db, request.email)

    if existing_email_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 가입된 이메일입니다.",
        )

    existing_username_user = (
        db.query(User)
        .filter(User.username == request.username)
        .first()
    )

    if existing_username_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 username입니다.",
        )

    verification = get_latest_email_verification(db, request.email)

    if verification is None or not verification.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이메일 인증이 필요합니다.",
        )

    user = User(
        email=request.email,
        username=request.username,
        display_name=request.display_name,
        hashed_password=hash_password(request.password),
        is_editor=False,
        is_admin=False,
        is_active=True,
        is_email_verified=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(db, request.email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다.",
        )

    user.last_login_at = utc_now()
    db.commit()

    access_token = create_access_token(
        subject=str(user.id),
        extra_data={
            "email": user.email,
            "is_editor": user.is_editor,
            "is_admin": user.is_admin,
        },
    )

    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserMeResponse)
def me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/password-reset/request", response_model=MessageResponse)
def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(db, request.email)

    # 보안상 이메일 존재 여부를 노출하지 않는다.
    if user is None:
        return MessageResponse(message="비밀번호 재설정 안내를 발송했습니다.")

    latest_token = get_latest_password_reset_token(db, user.id)

    if latest_token is not None:
        seconds_since_last_request = (
            utc_now() - latest_token.created_at
        ).total_seconds()

        if seconds_since_last_request < settings.AUTH_CODE_RESEND_SECONDS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="비밀번호 재설정 코드는 잠시 후 다시 요청할 수 있습니다.",
            )

    code = generate_6_digit_code()

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=hash_token(code),
        expires_at=utc_now() + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES),
        attempts=0,
        max_attempts=settings.MAX_AUTH_ATTEMPTS,
    )

    db.add(reset_token)
    db.commit()

    # 1차 개발용: 실제 이메일 대신 콘솔 출력
    print(f"[PASSWORD RESET CODE] {request.email}: {code}")

    return MessageResponse(message="비밀번호 재설정 안내를 발송했습니다.")


@router.post("/password-reset/confirm", response_model=MessageResponse)
def confirm_password_reset(
    request: PasswordResetConfirmRequest,
    db: Session = Depends(get_db),
):
    user = get_user_by_email(db, request.email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="비밀번호 재설정 정보가 올바르지 않습니다.",
        )

    reset_token = get_latest_password_reset_token(db, user.id)

    if reset_token is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="비밀번호 재설정 요청 내역이 없습니다.",
        )

    if reset_token.used_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용된 재설정 코드입니다.",
        )

    if reset_token.expires_at < utc_now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="재설정 코드가 만료되었습니다.",
        )

    if reset_token.attempts >= reset_token.max_attempts:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="재설정 시도 횟수를 초과했습니다.",
        )

    reset_token.attempts += 1

    if not verify_token(request.code, reset_token.token_hash):
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="재설정 코드가 올바르지 않습니다.",
        )

    user.hashed_password = hash_password(request.new_password)
    reset_token.verified_at = utc_now()
    reset_token.used_at = utc_now()

    db.commit()

    return MessageResponse(message="비밀번호가 변경되었습니다.")