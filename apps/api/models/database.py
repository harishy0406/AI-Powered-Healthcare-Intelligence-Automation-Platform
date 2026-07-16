"""CareCopilot API — SQLAlchemy models matching the PRD data model."""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum as SAEnum
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from datetime import datetime
import enum

from config import get_settings

Base = declarative_base()


# --- Enums ---
class UserRole(str, enum.Enum):
    admin = "admin"
    staff = "staff"


class AppointmentStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    no_show = "no_show"
    cancelled = "cancelled"


# --- Models ---
class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    config = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="clinic")
    patients = relationship("Patient", back_populates="clinic")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.staff, nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    clinic = relationship("Clinic", back_populates="users")
    chat_queries = relationship("ChatQuery", back_populates="user")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    source_type = Column(String(50), default="pdf")
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("DocumentChunk", back_populates="document")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    content = Column(Text, nullable=False)
    page_ref = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="chunks")


class ChatQuery(Base):
    __tablename__ = "chat_queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    sources = Column(Text, default="[]")  # JSON string
    feedback = Column(String(10))  # "up", "down", or null
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_queries")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    name = Column(String(200), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    phone = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    clinic = relationship("Clinic", back_populates="patients")
    intake_forms = relationship("IntakeForm", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")


class IntakeForm(Base):
    __tablename__ = "intake_forms"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    symptoms = Column(Text, nullable=False)
    duration = Column(String(100))
    severity = Column(String(50))
    medications = Column(Text)
    raw_input = Column(Text)
    ai_summary = Column(Text)
    reviewed_by = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="intake_forms")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    provider = Column(String(200), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(SAEnum(AppointmentStatus), default=AppointmentStatus.scheduled)
    complaint = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")


# --- Database engine & session ---
def get_engine():
    settings = get_settings()
    return create_async_engine(settings.database_url, echo=False)


def get_session_maker():
    engine = get_engine()
    return async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    """FastAPI dependency to get an async database session."""
    session_maker = get_session_maker()
    async with session_maker() as session:
        yield session


async def create_tables():
    """Create all tables in the database."""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
