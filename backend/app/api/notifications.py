from typing import Dict, Any
from fastapi import APIRouter, Depends
from backend.app.api.deps import get_current_user
from backend.app.database.repo import repo

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_user_notifications(current_user: Dict[str, Any] = Depends(get_current_user)):
    return repo.list_notifications(current_user["id"])

@router.patch("/{id}/read")
def mark_notification_read(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    repo.mark_notification_read(id, current_user["id"])
    return {"message": "Notification marked as read"}

@router.post("/read-all")
def mark_all_notifications_read(current_user: Dict[str, Any] = Depends(get_current_user)):
    repo.mark_all_notifications_read(current_user["id"])
    return {"message": "All notifications marked as read"}
