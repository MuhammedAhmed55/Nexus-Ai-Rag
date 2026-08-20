from io import BytesIO

import pandas as pd

from app.models.ingestion import RawChunk


def load_csv(file_bytes: bytes) -> list[RawChunk]:
    """
    Renders each row as 'column: value' pairs so retrieval can match on
    field names, and keeps the row index in metadata for citation
    (message_sources rows show 'row 118' style references).
    """
    df = pd.read_csv(BytesIO(file_bytes))
    chunks: list[RawChunk] = []

    for i, row in df.iterrows():
        content = "\n".join(f"{col}: {val}" for col, val in row.items())
        chunks.append(
            RawChunk(
                content=content,
                page_number=None,
                chunk_index=int(i),
                metadata={"source_type": "csv", "row": int(i)},
            )
        )

    return chunks