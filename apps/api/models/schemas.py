"""Pydantic request/response schemas."""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- Auth ---
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# --- Chat ---
class ChatRequest(BaseModel):
    question: str


class ChatSource(BaseModel):
    title: str
    page: Optional[str] = None


class ChatResponse(BaseModel):
    id: int
    question: str
    answer: str
    sources: list[ChatSource]
    latency_ms: int


class FeedbackRequest(BaseModel):
    query_id: int
    feedback: str  # "up" or "down"


# --- Intake ---
class IntakeRequest(BaseModel):
    patient_name: str
    symptoms: str
    duration: Optional[str] = None
    severity: Optional[str] = "Moderate"
    medications: Optional[str] = None


class IntakeResponse(BaseModel):
    id: int
    patient_name: str
    symptoms: str
    duration: Optional[str]
    severity: Optional[str]
    medications: Optional[str]
    ai_summary: Optional[str]
    reviewed_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class IntakeReviewRequest(BaseModel):
    reviewed_by: str
    ai_summary: Optional[str] = None  # Allow editing the summary


# --- Analytics ---
class AnalyticsOverview(BaseModel):
    total_patients: int
    total_appointments: int
    completed_appointments: int
    no_show_count: int
    no_show_rate: float
    top_complaints: list[dict]
    monthly_volume: list[dict]
    ai_queries_count: int


# --- Documents ---
class DocumentOut(BaseModel):
    id: int
    title: str
    source_type: str
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Appointments ---
class AppointmentOut(BaseModel):
    id: int
    patient_id: int
    provider: str
    scheduled_at: datetime
    status: str
    complaint: Optional[str]

    class Config:
        from_attributes = True
