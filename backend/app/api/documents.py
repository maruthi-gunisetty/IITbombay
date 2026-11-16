import os
import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from backend.app.api.deps import get_current_user, record_audit
from backend.app.services.document_service import document_service
from backend.app.database.repo import repo
from backend.app.core.config import settings

DOCS_DIR = os.path.join(settings.UPLOAD_DIR, "documents")
os.makedirs(DOCS_DIR, exist_ok=True)

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])

@router.get("")
def list_documents(
    loan_application_id: Optional[int] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"] if current_user.get("account_type") == "Customer" else None
    return repo.list_documents(user_id=user_id, loan_id=loan_application_id)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    loan_application_id: Optional[int] = Form(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    filename = file.filename or "uploaded_document.pdf"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg", ".tiff"]:
        raise HTTPException(status_code=400, detail="Unsupported document file type. Upload PDF, PNG, or JPG.")

    unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
    save_path = os.path.join(DOCS_DIR, unique_filename)
    
    contents = await file.read()
    file_size_kb = round(len(contents) / 1024.0, 2)
    with open(save_path, "wb") as f:
        f.write(contents)

    ocr_result = document_service.extract_document_data(filename, document_type, contents)

    doc_obj = repo.create_document({
        "user_id": current_user["id"],
        "loan_application_id": loan_application_id,
        "document_type": document_type,
        "file_name": filename,
        "file_path": save_path,
        "file_size_kb": file_size_kb,
        "mime_type": file.content_type or "application/octet-stream",
        "ocr_status": ocr_result["ocr_status"],
        "verification_status": ocr_result["verification_status"],
        "extracted_text": ocr_result["extracted_text"],
        "extracted_fields": ocr_result["extracted_fields"],
        "validation_flags": ocr_result["validation_flags"]
    })

    repo.create_notification(
        user_id=current_user["id"],
        category="Document",
        title="Document OCR Complete",
        message=f"{filename} successfully processed with verification status '{doc_obj['verification_status']}'.",
        link="/dashboard/documents"
    )

    record_audit(current_user, "DOCUMENT_UPLOADED", "UploadedDocument", str(doc_obj["id"]), f"Ingested {filename}")
    return doc_obj

@router.get("/{id}")
def get_document(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    doc = repo.get_document(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if current_user.get("account_type") == "Customer" and doc.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return doc

@router.delete("/{id}")
def delete_document(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    doc = repo.get_document(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if current_user.get("account_type") == "Customer" and doc.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    if os.path.exists(doc.get("file_path", "")):
        try:
            os.remove(doc["file_path"])
        except Exception:
            pass

    repo.delete_document(id)
    record_audit(current_user, "DOCUMENT_DELETED", "UploadedDocument", str(id), f"Deleted {doc.get('file_name')}")
    return {"message": "Document removed successfully"}
