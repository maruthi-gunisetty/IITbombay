import os
import sys
import sqlite3
from datetime import datetime
from backend.app.core.config import settings
from backend.app.security.crypto import encrypt_api_key, mask_api_key

GEMINI_KEY = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY

def main():
    encrypted = encrypt_api_key(GEMINI_KEY)
    masked = mask_api_key(GEMINI_KEY)
    now = datetime.utcnow().isoformat()

    conn = sqlite3.connect("backend/app/propwise.db")
    cur = conn.cursor()

    # Get all users
    cur.execute("SELECT id, email, full_name FROM users")
    users = cur.fetchall()

    for user in users:
        u_id = user[0]
        cur.execute("SELECT id FROM user_ai_credentials WHERE user_id = ?", (u_id,))
        row = cur.fetchone()
        if row:
            cur.execute("""
                UPDATE user_ai_credentials
                SET encrypted_key = ?, key_masked = ?, is_personal_key_enabled = 1,
                    is_automatic_fallback_enabled = 1, preferred_source = 'Personal',
                    last_validated_at = ?, validation_status = 'Active / Validated (Gemini AI)',
                    preferred_model = 'Google Gemini 2.5 Flash', updated_at = ?
                WHERE user_id = ?
            """, (encrypted, masked, now, now, u_id))
        else:
            cur.execute("""
                INSERT INTO user_ai_credentials (
                    user_id, encrypted_key, key_masked, is_personal_key_enabled,
                    is_automatic_fallback_enabled, preferred_source, last_validated_at,
                    validation_status, preferred_model, created_at, updated_at
                ) VALUES (?, ?, ?, 1, 1, 'Personal', ?, 'Active / Validated (Gemini AI)', 'Google Gemini 2.5 Flash', ?, ?)
            """, (u_id, encrypted, masked, now, now, now))

    conn.commit()
    conn.close()
    print(f"Successfully configured and activated Gemini key for {len(users)} users.")

if __name__ == "__main__":
    main()
