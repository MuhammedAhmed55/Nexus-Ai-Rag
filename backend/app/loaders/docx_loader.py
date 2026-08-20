from io import BytesIO

from docx import Document as DocxDocument

from app.models.ingestion import RawChunk


def load_docx(file_bytes: bytes) -> list[RawChunk]:
    """
    DOCX has no native page concept, so page_number stays None here —
    the chunker assigns paragraph-range metadata instead for citations.
    """
    doc = DocxDocument(BytesIO(file_bytes))
    full_text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())

    if not full_text.strip():
        return []

    return [
        RawChunk(
            content=full_text,
            page_number=None,
            chunk_index=0,
            metadata={"source_type": "docx"},
        )
    ]