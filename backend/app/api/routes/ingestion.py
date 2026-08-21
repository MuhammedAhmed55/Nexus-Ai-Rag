from fastapi import APIRouter, File, UploadFile, Depends
from uuid import UUID, uuid4

from app.models.ingestion import IngestionJobResult
from app.models.document import DocumentOut
from app.services.ingestion_service import process_document
from app.repositories.document_repository import create_document, get_documents, delete_document
from app.core.security import get_current_user, CurrentUser

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload", response_model=IngestionJobResult)
async def upload_document(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user)
):
    # user_id now comes from a verified Supabase JWT — whichever user's
    # access token the frontend sends is who owns this document. No more
    # hardcoded UUID, so this works correctly per-user out of the box.
    doc_id = uuid4()

    await create_document(
        document_id=doc_id,
        user_id=current_user.id,
        name=file.filename,
        file_type=file.content_type,
        file_size=file.size,
    )

    return await process_document(file, doc_id, current_user.id)

@router.get("", response_model=list[DocumentOut])
async def list_documents(
    current_user: CurrentUser = Depends(get_current_user)
):
    return await get_documents(current_user.id)

@router.delete("/{document_id}")
async def remove_document(
    document_id: UUID,
    current_user: CurrentUser = Depends(get_current_user)
):
    await delete_document(document_id, current_user.id)
    return {"message": "Document deleted successfully"}