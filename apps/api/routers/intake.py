"""Intake router — patient intake form + AI summarization."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.database import IntakeForm, User, get_db
from models.schemas import IntakeRequest, IntakeResponse, IntakeReviewRequest
from services.auth_service import get_current_user
from services.llm_service import generate_intake_summary

router = APIRouter(prefix="/api/intake", tags=["Intake"])


@router.post("", response_model=IntakeResponse)
async def create_intake(
    request: IntakeRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Generate AI summary
    intake_data = {
        "patient_name": request.patient_name,
        "symptoms": request.symptoms,
        "duration": request.duration,
        "severity": request.severity,
        "medications": request.medications,
    }
    ai_summary = await generate_intake_summary(intake_data)

    form = IntakeForm(
        symptoms=request.symptoms,
        duration=request.duration,
        severity=request.severity,
        medications=request.medications,
        raw_input=f"Patient: {request.patient_name}",
        ai_summary=ai_summary,
    )
    db.add(form)
    await db.commit()
    await db.refresh(form)

    return IntakeResponse(
        id=form.id,
        patient_name=request.patient_name,
        symptoms=form.symptoms,
        duration=form.duration,
        severity=form.severity,
        medications=form.medications,
        ai_summary=form.ai_summary,
        reviewed_by=form.reviewed_by,
        created_at=form.created_at,
    )


@router.patch("/{intake_id}/review")
async def review_intake(
    intake_id: int,
    request: IntakeReviewRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(IntakeForm).where(IntakeForm.id == intake_id))
    form = result.scalar_one_or_none()
    if not form:
        raise HTTPException(status_code=404, detail="Intake form not found")

    form.reviewed_by = request.reviewed_by
    if request.ai_summary:
        form.ai_summary = request.ai_summary
    await db.commit()
    return {"status": "reviewed", "id": intake_id}


@router.get("")
async def list_intakes(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(IntakeForm).order_by(IntakeForm.created_at.desc()).limit(50))
    forms = result.scalars().all()
    return [
        {
            "id": f.id,
            "symptoms": f.symptoms,
            "duration": f.duration,
            "severity": f.severity,
            "ai_summary": f.ai_summary,
            "reviewed_by": f.reviewed_by,
            "created_at": f.created_at.isoformat() if f.created_at else None,
        }
        for f in forms
    ]
