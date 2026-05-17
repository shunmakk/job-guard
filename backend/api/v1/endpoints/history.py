from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from auth.clerk_auth import get_current_user
from repositories.job_repository import JobRepository
from repositories.user_repository import UserRepository
from schemas.history import JobMyPageHistoryDetailResponse, JobMyPageHistoryResponse
from services.history_service import HistoryService

router = APIRouter()


@router.get("/mypage", response_model=list[JobMyPageHistoryResponse])
def get_job_analysis_history(
    payload=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = HistoryService(UserRepository(db), JobRepository(db))
    return service.get_histories(payload["sub"])


@router.get("/mypage/{analysis_id}", response_model=JobMyPageHistoryDetailResponse)
def get_job_analysis_history_detail(
    analysis_id: str,
    payload=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = HistoryService(UserRepository(db), JobRepository(db))
    return service.get_history_detail(payload["sub"], analysis_id)
