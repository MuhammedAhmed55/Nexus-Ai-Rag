import re
from typing import Optional

from langsmith import traceable


class InputSanitizer:

    INJECTION_PATTERNS = [
        r"ignore\s+all\s+previous\s+instructions",
        r"forget\s+all\s+previous",
        r"new\s+instructions\s*:",
        r"system\s*:\s*prompt",
        r"^.*?end\s*(of)?\s*prompt",
        r"pretend\s+you're\s+are",
        r"act\s+as\s+(if\s+)?you",
        r"bypass\s+all\s+restrictions",
        r"reveal\s+your\s+(system\s+instructions|prompt)",
    ]

    def __init__(self):
        self.patterns = [
            re.compile(pattern, re.IGNORECASE)
            for pattern in self.INJECTION_PATTERNS
        ]

    def check(self, text: str) -> tuple[bool, Optional[str]]:
        for pattern in self.patterns:
            if pattern.search(text):
                return True, "Blocked: potential prompt injection detected"
        return False, None

    def clean(self, text: str) -> str:
        text = re.sub(r"[-]{3,}", "", text)
        text = re.sub(r"[=]{3,}", "", text)
        text = text.replace("{{", "{ {").replace("}}", "} }")
        return text.strip()


class PIIDetector:

    PATTERNS = {
        "email": re.compile(
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        ),
        "phone": re.compile(
            r"\b(\+?\d{1,3}[-.\s]?)?"
            r"(\(?\d{3}\)?[-.\s]?)?"
            r"\d{3}[-.\s]?\d{4}\b"
        ),
        "ssn": re.compile(
            r"\b\d{3}-\d{2}-\d{4}\b"
        ),
        "credit_card": re.compile(
            r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b"
        ),
    }

    MASK_MAP = {
        "email": "[EMAIL]",
        "phone": "[PHONE]",
        "ssn": "[SSN]",
        "credit_card": "[CREDIT_CARD]",
    }

    def detect(self, text: str) -> dict[str, list[str]]:
        found = {}
        for pii_type, pattern in self.PATTERNS.items():
            matches = pattern.findall(text)
            if matches:
                found[pii_type] = matches
        return found

    def mask(self, text: str) -> str:
        masked = text
        for pii_type, pattern in self.PATTERNS.items():
            masked = pattern.sub(
                self.MASK_MAP[pii_type],
                masked
            )
        return masked


class OutputValidator:

    HARMFUL_PATTERNS = [
        re.compile(r"here('s| is) (how|the way) to (hack|steal|attack)", re.I),
        re.compile(r"password\s+is\s+\w+", re.I),
        re.compile(r"api[_\s]?key\s*[:=]", re.I),
    ]

    def __init__(self):
        self.pii_detector = PIIDetector()

    def validate(self, output: str) -> tuple[str , list[str]]:
        warnings = []
        pii_found = self.pii_detector.detect(output)
        if pii_found:
            warnings.append(f"PII detected: {pii_found}")
            output = self.pii_detector.mask(output)
        for pattern in self.HARMFUL_PATTERNS:
            if pattern.search(output):
                warnings.append("Harmful content detected.")
                break
        return output, warnings


class SecurityPipeline:
    def __init__(self):
        self.sanitizer = InputSanitizer()
        self.pii_detector = PIIDetector()
        self.output_validator = OutputValidator()

    @traceable(name = "security_check_input")
    def check_input(self , text: str) -> tuple[bool , str , list[str]]:
        notes = []
        is_injection, reason = self.sanitizer.check(text)
        if is_injection:
            return False, "", [reason]
        cleaned = self.sanitizer.clean(text)
        pii_found = self.pii_detector.detect(cleaned)
        if pii_found:
            cleaned = self.pii_detector.mask(cleaned)
            notes.append(f"PII detected and masked: {list(pii_found.keys())}")
        return True , cleaned , notes

    @traceable(name = "security_check_output")
    def check_output(self , text: str) -> tuple[str , list[str]]:
        return self.output_validator.validate(text)


# ============================================================
# Auth — verifies the Supabase JWT the frontend sends as
# Authorization: Bearer <token>, resolves the real user_id.
# Separate concern from the content-safety pipeline above:
# that pipeline decides whether a message is safe to process,
# this decides who is making the request.
# ============================================================
from dataclasses import dataclass
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client

from app.core.config import get_settings

bearer_scheme = HTTPBearer()
_auth_client: Client | None = None


def _get_auth_client() -> Client:
    """
    Separate lightweight client just for token verification — keeps this
    decoupled from repositories/vector_repository.py's own client instance,
    which exists purely for data access, not auth.
    """
    global _auth_client
    if _auth_client is None:
        settings = get_settings()
        _auth_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )
    return _auth_client


@dataclass
class CurrentUser:
    id: UUID
    email: str | None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> CurrentUser:
    """
    Verifies the Supabase access token forwarded by the frontend
    (lib/api.ts attaches it as Authorization: Bearer <token> on every
    request, reading it off the client-side Supabase session).
    """
    token = credentials.credentials
    supabase = _get_auth_client()

    try:
        response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if response.user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return CurrentUser(id=UUID(response.user.id), email=response.user.email)