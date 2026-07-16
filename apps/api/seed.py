"""Seed the database with synthetic demo data."""

import json
import os
import asyncio
from datetime import datetime

from sqlalchemy import select
from models.database import (
    Base, Clinic, User, Patient, Appointment, Document,
    UserRole, AppointmentStatus,
    get_engine, get_session_maker
)
from services.auth_service import hash_password

SEED_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "seed")


async def seed_database():
    """Populate the database with demo data if it's empty."""
    engine = get_engine()

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_maker = get_session_maker()
    async with session_maker() as db:
        # Check if already seeded
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        print("Seeding database...")

        # 1. Create clinic
        clinic = Clinic(id=1, name="CareCopilot Demo Clinic")
        db.add(clinic)

        # 2. Create users
        admin = User(
            name="Dr. Priya Sharma",
            email="admin@carecopilot.com",
            hashed_password=hash_password("demo123"),
            role=UserRole.admin,
            clinic_id=1,
        )
        staff = User(
            name="Rahul Verma",
            email="staff@carecopilot.com",
            hashed_password=hash_password("demo123"),
            role=UserRole.staff,
            clinic_id=1,
        )
        db.add_all([admin, staff])

        # 3. Seed patients
        patients_path = os.path.join(SEED_DIR, "patients.json")
        if os.path.exists(patients_path):
            with open(patients_path, "r", encoding="utf-8") as f:
                patients_data = json.load(f)
            for p in patients_data:
                patient = Patient(
                    id=p["id"],
                    clinic_id=1,
                    name=p["name"],
                    age=p.get("age"),
                    gender=p.get("gender"),
                    phone=p.get("phone"),
                    created_at=datetime.fromisoformat(p["created_at"]),
                )
                db.add(patient)
            print(f"  Seeded {len(patients_data)} patients")

        # 4. Seed appointments
        appointments_path = os.path.join(SEED_DIR, "appointments.json")
        if os.path.exists(appointments_path):
            with open(appointments_path, "r", encoding="utf-8") as f:
                appointments_data = json.load(f)
            for a in appointments_data:
                appointment = Appointment(
                    id=a["id"],
                    patient_id=a["patient_id"],
                    provider=a["provider"],
                    scheduled_at=datetime.fromisoformat(a["scheduled_at"]),
                    status=AppointmentStatus(a["status"]),
                    complaint=a.get("complaint"),
                )
                db.add(appointment)
            print(f"  Seeded {len(appointments_data)} appointments")

        # 5. Seed documents (metadata only)
        demo_docs = [
            {"title": "ADA Standards of Care in Diabetes 2024", "source_type": "pdf", "chunk_count": 128},
            {"title": "GINA 2024 - Global Strategy for Asthma Management", "source_type": "pdf", "chunk_count": 215},
            {"title": "ACC/AHA Hypertension Guidelines 2017", "source_type": "pdf", "chunk_count": 94},
            {"title": "WHO Essential Medicines List 2023", "source_type": "pdf", "chunk_count": 76},
            {"title": "Clinic Drug Interaction Reference", "source_type": "text", "chunk_count": 42},
        ]
        for d in demo_docs:
            doc = Document(
                title=d["title"],
                source_type=d["source_type"],
                uploaded_by=1,  # admin
                chunk_count=d["chunk_count"],
            )
            db.add(doc)
        print(f"  Seeded {len(demo_docs)} documents")

        await db.commit()
        print("Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_database())
