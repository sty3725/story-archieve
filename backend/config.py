from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    EMAIL_CODE_EXPIRE_MINUTES: int = 5
    PASSWORD_RESET_EXPIRE_MINUTES: int = 10
    MAX_AUTH_ATTEMPTS: int = 5
    AUTH_CODE_RESEND_SECONDS: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()