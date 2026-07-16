"""Analytics router — aggregated dashboard stats."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.database import Patient, Appointment, ChatQuery, AppointmentStatus, get_db
from models.schemas import AnalyticsOverview
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview(
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    # Total patients
    result = await db.execute(select(func.count(Patient.id)))
    total_patients = result.scalar() or 0

    # Appointments
    result = await db.execute(select(func.count(Appointment.id)))
    total_appointments = result.scalar() or 0

    result = await db.execute(
        select(func.count(Appointment.id)).where(Appointment.status == AppointmentStatus.completed)
    )
    completed = result.scalar() or 0

    result = await db.execute(
        select(func.count(Appointment.id)).where(Appointment.status == AppointmentStatus.no_show)
    )
    no_show_count = result.scalar() or 0

    no_show_rate = (no_show_count / total_appointments * 100) if total_appointments > 0 else 0

    # Top complaints
    result = await db.execute(
        select(Appointment.complaint, func.count(Appointment.id).label("count"))
        .where(Appointment.complaint.isnot(None))
        .group_by(Appointment.complaint)
        .order_by(func.count(Appointment.id).desc())
        .limit(5)
    )
    top_complaints = [{"condition": row[0], "count": row[1]} for row in result.all()]

    # Monthly volume (simplified — count by month from appointments)
    result = await db.execute(
        select(
            func.strftime("%Y-%m", Appointment.scheduled_at).label("month"),
            func.count(Appointment.id).label("count"),
        )
        .group_by("month")
        .order_by("month")
    )
    monthly_volume = [{"month": row[0], "appointments": row[1]} for row in result.all()]

    # AI queries count
    result = await db.execute(select(func.count(ChatQuery.id)))
    ai_queries = result.scalar() or 0

    return AnalyticsOverview(
        total_patients=total_patients,
        total_appointments=total_appointments,
        completed_appointments=completed,
        no_show_count=no_show_count,
        no_show_rate=round(no_show_rate, 1),
        top_complaints=top_complaints,
        monthly_volume=monthly_volume,
        ai_queries_count=ai_queries,
    )
