from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import chat, ingestion

app = FastAPI(title="Nexus AI Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[], 
    allow_origin_regex=".*", # Allow any origin (including LAN IPs) with credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1")
app.include_router(ingestion.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Nexus AI Backend Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
