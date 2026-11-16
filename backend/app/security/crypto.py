import os
import hashlib
import binascii
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from backend.app.core.config import settings

def hash_password(password: str) -> str:
    """Hashes password using PBKDF2 HMAC SHA-256 with a secure 16-byte salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100_000)
    return binascii.hexlify(salt).decode('ascii') + ":" + binascii.hexlify(key).decode('ascii')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored salt:hash string."""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = binascii.unhexlify(salt_hex.encode('ascii'))
        key = binascii.unhexlify(key_hex.encode('ascii'))
        new_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100_000)
        return new_key == key
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token with user claims."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        return None

# AES-256-GCM Encryption for BYOK Personal API Keys
def get_aes_key() -> bytes:
    # Ensure 32 bytes for AES-256
    raw_key = settings.AES_ENCRYPTION_KEY.encode('utf-8')
    return hashlib.sha256(raw_key).digest()

def encrypt_api_key(plain_key: str) -> str:
    """Encrypts a plaintext API key with AES-256-GCM. Returns hex(nonce + ciphertext)."""
    if not plain_key:
        return ""
    key = get_aes_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # Standard 96-bit nonce for GCM
    ct = aesgcm.encrypt(nonce, plain_key.encode('utf-8'), None)
    payload = nonce + ct
    return binascii.hexlify(payload).decode('ascii')

def decrypt_api_key(encrypted_hex: str) -> Optional[str]:
    """Decrypts a hex-encoded (nonce + ciphertext) string using AES-256-GCM."""
    if not encrypted_hex:
        return None
    try:
        key = get_aes_key()
        aesgcm = AESGCM(key)
        data = binascii.unhexlify(encrypted_hex.encode('ascii'))
        nonce = data[:12]
        ct = data[12:]
        plain_bytes = aesgcm.decrypt(nonce, ct, None)
        return plain_bytes.decode('utf-8')
    except Exception:
        return None

def mask_api_key(key: str) -> str:
    """Returns a secure masked version of the key: e.g., sk-or-v1-••••••••abcd"""
    if not key or len(key) < 8:
        return "••••••••"
    prefix = key[:6]
    suffix = key[-4:]
    return f"{prefix}••••••••{suffix}"
