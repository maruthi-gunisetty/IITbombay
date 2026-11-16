from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from typing import Dict, Any
from backend.app.schemas.schemas import (
    UserCreate, UserLogin, ForgotPasswordRequest, ResetPasswordRequest
)
from backend.app.security.crypto import hash_password, verify_password, create_access_token, decode_access_token
from backend.app.database.repo import repo
from backend.app.api.deps import get_current_user, record_audit

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user_in: UserCreate):
    existing = repo.get_user_by_email(user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists")

    account_type = user_in.account_type
    if account_type == "Admin":
        admins = repo.list_users(role="Admin")
        if len(admins) > 0:
            account_type = "Customer"

    new_user = repo.create_user(
        full_name=user_in.full_name,
        email=user_in.email,
        phone_number=user_in.phone_number,
        hashed_password=hash_password(user_in.password),
        account_type=account_type
    )

    repo.record_consent(new_user["id"], "Platform Terms & AI Decision Support Processing")
    record_audit(new_user, "USER_REGISTERED", "User", str(new_user["id"]), f"Registered as {account_type}")

    token = create_access_token(data={"sub": str(new_user["id"]), "email": new_user["email"], "role": new_user["account_type"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "full_name": new_user["full_name"],
            "email": new_user["email"],
            "phone_number": new_user["phone_number"],
            "account_type": new_user["account_type"],
            "is_active": bool(new_user["is_active"]),
            "is_verified": bool(new_user["is_verified"]),
            "created_at": new_user["created_at"]
        }
    }

@router.post("/login")
def login(creds: UserLogin):
    user = repo.get_user_by_email(creds.email)
    if not user or not verify_password(creds.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password credentials")

    if not user.get("is_active"):
        raise HTTPException(status_code=400, detail="User account is deactivated")

    expire_delta = timedelta(days=7) if creds.remember_me else timedelta(hours=24)
    token = create_access_token(
        data={"sub": str(user["id"]), "email": user["email"], "role": user["account_type"]},
        expires_delta=expire_delta
    )

    record_audit(user, "USER_LOGIN_SUCCESS", "User", str(user["id"]), "User logged in successfully")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "phone_number": user.get("phone_number"),
            "account_type": user["account_type"],
            "is_active": bool(user["is_active"]),
            "is_verified": bool(user["is_verified"]),
            "created_at": user["created_at"]
        }
    }

@router.get("/me")
def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "full_name": current_user["full_name"],
        "email": current_user["email"],
        "phone_number": current_user.get("phone_number"),
        "account_type": current_user["account_type"],
        "is_active": bool(current_user["is_active"]),
        "is_verified": bool(current_user["is_verified"]),
        "created_at": current_user["created_at"]
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    user = repo.get_user_by_email(req.email)
    if not user:
        return {"message": "If the account exists, a secure password reset link has been dispatched."}

    reset_token = create_access_token(
        data={"sub": str(user["id"]), "type": "password_reset"},
        expires_delta=timedelta(minutes=15)
    )
    record_audit(user, "PASSWORD_RESET_REQUESTED", "User", str(user["id"]), "Reset link generated")
    return {
        "message": "Secure password reset token generated successfully.",
        "demo_reset_token": reset_token
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    payload = decode_access_token(req.token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user_id = payload.get("sub")
    user = repo.get_user_by_id(int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    from backend.app.database.db import get_connection
    conn = get_connection()
    c = conn.cursor()
    c.execute("UPDATE users SET hashed_password = ? WHERE id = ?", (hash_password(req.new_password), user["id"]))
    conn.commit()
    conn.close()

    record_audit(user, "PASSWORD_RESET_COMPLETED", "User", str(user["id"]), "Password updated")
    return {"message": "Password updated successfully. You can now login with your new credentials."}

@router.post("/logout")
def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    record_audit(current_user, "USER_LOGOUT", "User", str(current_user["id"]), "User logged out")
    return {"message": "Session terminated successfully"}
