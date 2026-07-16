"""Appointments router — list and filter appointments."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from models.database import Appointment, get_db
from models.schemas import AppointmentOut
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


@router.get("", response_model=list[AppointmentOut])
async def list_appointments(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    query = select(Appointment).order_by(Appointment.scheduled_at.desc())
    if status:
        query = query.where(Appointment.status == status)
    query = query.limit(limit)

    result = await db.execute(query)
    return result.scalars().all()
