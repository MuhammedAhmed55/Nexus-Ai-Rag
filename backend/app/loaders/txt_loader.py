from app.models.ingestion import RawChunk


def load_txt(file_bytes: bytes) -> list[RawChunk]:
    text = file_bytes.decode("utf-8", errors="ignore").strip()
    if not text:
        return []

    return [
        RawChunk(
            content=text,
            page_number=None,
            chunk_index=0,
            metadata={"source_type": "txt"},
        )
    ]