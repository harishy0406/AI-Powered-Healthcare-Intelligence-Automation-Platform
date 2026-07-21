"""LLM service — Groq primary, Gemini fallback, mock mode when no keys."""

import httpx
import json
import time
from config import get_settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_PROMPT = """You are CareCopilot, a clinical decision-support AI assistant for a small clinic. 

CRITICAL RULES:
1. ONLY answer from the provided context. If the context doesn't contain relevant information, say "I couldn't find specific information in the knowledge base. Please consult a licensed clinician."
2. ALWAYS cite your sources inline using [Source N] notation.
3. NEVER provide direct diagnoses — you provide decision-support information only.
4. Include a disclaimer that this is for informational purposes only.
5. Format your response clearly with headers, bullet points, and structure.
6. If discussing medications, include common dosages, contraindications, and key interactions.

You are speaking to healthcare staff and clinicians who need quick, accurate, citation-backed answers."""

INTAKE_PROMPT = """You are a clinical note summarizer for a small clinic.

Given the patient intake data below, generate a structured clinical summary. Include:
1. **Chief Complaint** — primary reason for visit
2. **Duration** — how long symptoms have been present
3. **Assessment** — clinical interpretation of reported symptoms
4. **Current Medications** — list of medications patient is taking
5. **🚩 Flags** — any red flags or concerning findings
6. **Suggested Next Steps** — recommended actions for the clinician

Keep the summary concise but clinically useful. Use medical terminology where appropriate.
This is decision support only — the summary must be reviewed by a licensed clinician before use."""


async def generate_chat_response(question: str, context: str) -> str:
    """Generate a response using the RAG context."""
    settings = get_settings()

    user_message = f"""Context from knowledge base:
{context if context else "No relevant context found in the knowledge base."}

---

User question: {question}

Please answer the question using ONLY the context provided above. Cite sources using [Source N] notation."""

    # Try Groq first
    if settings.groq_api_key:
        try:
            return await _call_groq(user_message, SYSTEM_PROMPT, settings.groq_api_key)
        except Exception:
            pass

    # Fallback to Gemini
    if settings.google_api_key:
        try:
            return await _call_gemini(user_message, SYSTEM_PROMPT, settings.google_api_key)
        except Exception:
            pass

    # Mock mode — generate from context directly
    return _mock_response(question, context)


async def generate_intake_summary(intake_data: dict) -> str:
    """Generate an AI summary from intake form data."""
    settings = get_settings()

    user_message = f"""Patient Intake Data:
- Patient Name: {intake_data.get('patient_name', 'Unknown')}
- Symptoms: {intake_data.get('symptoms', 'Not provided')}
- Duration: {intake_data.get('duration', 'Not specified')}
- Severity: {intake_data.get('severity', 'Not rated')}
- Current Medications: {intake_data.get('medications', 'None reported')}

Generate a structured clinical summary."""

    


async def _call_groq(user_msg: str, system_msg: str, api_key: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg},
                ],
                "temperature": 0.3,
                "max_tokens": 1500,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


async def _call_gemini(user_msg: str, system_msg: str, api_key: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{GEMINI_URL}?key={api_key}",
            json={
                "system_instruction": {"parts": [{"text": system_msg}]},
                "contents": [{"parts": [{"text": user_msg}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 1500},
            },
        )
        resp.raise_for_status()
        return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


def _mock_response(question: str, context: str) -> str:
    """Fallback response when no LLM API keys are configured."""
    if not context:
        return (
            "I couldn't find specific information in the knowledge base for your query. "
            "Please try asking about topics covered in the uploaded clinical guidelines, "
            "or consult a licensed clinician for specific patient cases.\n\n"
            "⚠️ *Decision support only — not medical advice.*"
        )

    return (
        f"**Based on the knowledge base:**\n\n"
        f"{context[:1500]}\n\n"
        f"---\n\n"
        f"*Note: This response is generated in demo mode (no LLM API key configured). "
        f"Configure GROQ_API_KEY or GOOGLE_API_KEY in .env for AI-generated responses.*\n\n"
        f"⚠️ *Decision support only — not medical advice.*"
    )


def _mock_intake_summary(data: dict) -> str:
    """Fallback intake summary when no LLM is available."""
    symptoms = data.get("symptoms", "Not provided")
    chief = symptoms.split(",")[0].strip() if symptoms else "Not provided"
    severity = data.get("severity", "Moderate")

    flags = ""
    if severity == "Severe":
        flags = "- ⚠️ Severity rated as SEVERE — prioritize clinical review\n"
    else:
        flags = "- No immediate red flags identified\n"

    return (
        f"**Chief Complaint:** {chief}\n\n"
        f"**Duration:** {data.get('duration', 'Not specified')}\n\n"
        f"**Assessment:**\n"
        f"- Symptoms reported: {symptoms}\n"
        f"- Severity level: {severity}\n\n"
        f"**Current Medications:** {data.get('medications', 'None reported')}\n\n"
        f"**🚩 Flags:**\n{flags}\n"
        f"**Suggested Next Steps:**\n"
        f"- Complete physical examination\n"
        f"- Review patient history\n"
        f"- Order appropriate diagnostics\n"
        f"- Schedule follow-up as indicated\n\n"
        f"*Generated in demo mode — configure LLM API keys for AI-powered summaries.*"
    )
