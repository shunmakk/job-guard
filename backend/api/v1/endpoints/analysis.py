from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from auth.clerk_auth import get_current_user
from repositories.job_repository import JobRepository
from repositories.user_repository import UserRepository
from schemas.analysis import AnalyzeInputData
from services.analysis_service import AnalysisService

router = APIRouter()


@router.post("/analyze")
async def analyze(
    user_input: AnalyzeInputData,
    payload=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AnalysisService(UserRepository(db), JobRepository(db))
    return service.analyze(payload["sub"], user_input)
