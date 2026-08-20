import os
from uuid import UUID
from fastapi import UploadFile

from app.models.ingestion import IngestionJobResult, EmbeddedChunk
from app.rag.chunker import chunk_documents
from app.rag.embedding import embed_texts
from app.repositories.vector_repository import store_chunks
from app.repositories.document_repository import update_document_status
from app.core.monitoring import get_logger

from app.loaders.pdf_loader import load_pdf
from app.loaders.txt_loader import load_txt
from app.loaders.csv_loader import load_csv
from app.loaders.docx_loader import load_docx

logger = get_logger()

async def process_document(file: UploadFile, document_id: UUID, user_id: UUID) -> IngestionJobResult:
    try:
        await update_document_status(document_id, "processing")

        file_bytes = await file.read()
        suffix = os.path.splitext(file.filename)[1].lower()

        if suffix == ".pdf":
            raw_chunks = load_pdf(file_bytes)
        elif suffix in [".txt", ".md"]:
            raw_chunks = load_txt(file_bytes)
        elif suffix == ".csv":
            raw_chunks = load_csv(file_bytes)
        elif suffix == ".docx":
            raw_chunks = load_docx(file_bytes)
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

        chunked = chunk_documents(raw_chunks)

        if not chunked:
            raise ValueError("No text could be extracted from the document.")

        texts = [chunk.content for chunk in chunked]
        embeddings = await embed_texts(texts)

        embedded_chunks = []
        for i, chunk in enumerate(chunked):
            embedded_chunks.append(
                EmbeddedChunk(
                    content=chunk.content,
                    page_number=chunk.page_number,
                    chunk_index=chunk.chunk_index,
                    metadata=chunk.metadata,
                    embedding=embeddings[i]
                )
            )

        await store_chunks(embedded_chunks, document_id, user_id)
        await update_document_status(document_id, "completed", chunk_count=len(embedded_chunks))

        logger.info(f"Successfully processed document {document_id}")
        return IngestionJobResult(
            document_id=document_id,
            status="processed",
            chunk_count=len(embedded_chunks)
        )

    except Exception as e:
        logger.error(f"Failed to process document {document_id}: {e}")
        await update_document_status(document_id, "failed", error_message=str(e))
        return IngestionJobResult(
            document_id=document_id,
            status="error",
            chunk_count=0,
            error_message=str(e)
        )