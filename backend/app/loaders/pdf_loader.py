from pypdf import PdfReader

from app.models.ingestion import RawChunk


def load_pdf(file_bytes: bytes) -> list[RawChunk]:
    """
    Returns one RawChunk per page (pre-splitting). The chunker downstream
    will further split long pages, carrying page_number along so every
    citation can point to an exact page.
    """
    from io import BytesIO

    reader = PdfReader(BytesIO(file_bytes))
    chunks: list[RawChunk] = []

    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text = text.strip()
        if not text:
            continue
        chunks.append(
            RawChunk(
                content=text,
                page_number=i + 1,
                chunk_index=i,
                metadata={"source_type": "pdf"},
            )
        )

    return chunks