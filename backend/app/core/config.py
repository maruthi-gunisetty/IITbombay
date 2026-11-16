import os
from pydantic import BaseModel
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"))
except ImportError:
    pass

class Settings(BaseModel):
    PROJECT_NAME: str = "PROPWISE AI"
    TAGLINE: str = "Smarter Property Valuation. Safer Lending Decisions."
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "propwise_super_secret_jwt_key_2026_enterprise_production_grade")
    AES_ENCRYPTION_KEY: str = os.getenv("AES_ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef")  # 32 bytes hex for AES-256
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./backend/app/propwise.db")
    
    # Google Gemini AI configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")

    # OpenRouter AI default configuration
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "gemini-flash-lite-latest")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Upload storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
