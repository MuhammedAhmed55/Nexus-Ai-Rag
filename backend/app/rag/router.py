from langchain_core.messages import SystemMessage, HumanMessage
from langchain_ollama import ChatOllama
from app.core.config import get_settings
from app.core.monitoring import get_logger

logger = get_logger()

ROUTER_PROMPT = """You are an intelligent query router. Your ONLY job is to classify the user's message into one of three categories:

GENERAL: The user is asking a general question, saying hello, or asking something that can be answered using general knowledge without needing to search their uploaded documents.
DOCUMENT: The user is specifically asking a question about their uploaded documents, files, or specific context (e.g., "Summarize this", "What does the PDF say?").
MIXED: The user is asking a question where part of it requires general knowledge and part of it requires looking at their documents.

You must respond with EXACTLY ONE WORD: either GENERAL, DOCUMENT, or MIXED. Do not add punctuation, explanations, or any other text."""

async def classify_query(query: str) -> str:
    settings = get_settings()
    llm = ChatOllama(
        model=settings.primary_model,
        temperature=0,
        max_retries=1
    )
    
    messages = [
        SystemMessage(content=ROUTER_PROMPT),
        HumanMessage(content=f"User Message: {query}")
    ]
    
    try:
        response = await llm.ainvoke(messages)
        result = response.content.strip().upper()
        if result not in ["GENERAL", "DOCUMENT", "MIXED"]:
            logger.warning(f"Router returned invalid classification: {result}. Defaulting to MIXED.")
            return "MIXED"
        return result
    except Exception as e:
        logger.error(f"Error during query routing: {e}")
        # Default to MIXED to be safe so it searches documents if there's an error
        return "MIXED"
