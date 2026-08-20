import httpx
from bs4 import BeautifulSoup

from app.models.ingestion import RawChunk


async def load_web(url: str) -> list[RawChunk]:
    async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    cleaned = "\n".join(lines)

    if not cleaned:
        return []

    return [
        RawChunk(
            content=cleaned,
            page_number=None,
            chunk_index=0,
            metadata={"source_type": "web", "url": url},
        )
    ]