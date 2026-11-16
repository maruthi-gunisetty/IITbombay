from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any, Optional
from backend.app.security.crypto import decode_access_token
from backend.app.database.repo import repo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = repo.get_user_by_id(int(user_id))
    if user is None or not user.get("is_active"):
        raise HTTPException(status_code=400, detail="Inactive user or user not found")
    return user

def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user.get("account_type") != "Admin":
        raise HTTPException(status_code=403, detail="Administrative privilege required")
    return current_user

def require_bank_officer_or_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user.get("account_type") not in ("Admin", "Bank Officer"):
        raise HTTPException(status_code=403, detail="Bank Officer or Administrative clearance required")
    return current_user

def record_audit(user: Optional[Dict[str, Any]], action: str, resource_type: str, resource_id: str = None, details: str = None):
    try:
        user_id = user.get("id") if user else None
        user_email = user.get("email") if user else "anonymous"
        repo.log_audit(user_id, user_email, action, resource_type, resource_id, details)
    except Exception:
        pass
