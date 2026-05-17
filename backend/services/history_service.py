import uuid

from fastapi import HTTPException, status

from repositories.job_repository import JobRepository
from repositories.user_repository import UserRepository


class HistoryService:
    def __init__(self, user_repo: UserRepository, job_repo: JobRepository):
        self.user_repo = user_repo
        self.job_repo = job_repo

    def _get_user(self, clerk_id: str):
        user = self.user_repo.get_by_clerk_id(clerk_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="未認証です",
            )
        return user

    def _build_user_info_payload(self, user_info) -> dict:
        if user_info:
            return {
                "desired_salary": user_info.desired_salary,
                "age": user_info.age,
                "desired_holiday": user_info.desired_holiday,
                "max_overtime_hours": user_info.max_overtime_hours,
                "remote_preference": user_info.remote_preference,
                "work_style": user_info.work_style,
            }
        return {
            "desired_salary": None,
            "age": None,
            "desired_holiday": None,
            "max_overtime_hours": None,
            "remote_preference": None,
            "work_style": None,
        }

    def get_histories(self, clerk_id: str) -> list[dict]:
        user = self._get_user(clerk_id)
        user_info = self.user_repo.get_preferences(user.id)
        histories = self.job_repo.get_histories(user.id)

        if not histories:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="履歴が見つかりません",
            )

        user_info_payload = self._build_user_info_payload(user_info)

        return [
            {
                "user_info": user_info_payload,
                "analysis_id": str(history.id),
                "job_post_id": str(history.job_post_id),
                "job_post_title": history.job_post_title or "タイトル未設定",
                "industry": industry or "未設定",
                "matching_score": history.matching_score,
                "black_risk_score": history.black_risk_score,
                "matching_reason": history.matching_reason,
                "created_at": history.created_at.isoformat(),
            }
            for history, industry in histories
        ]

    def get_history_detail(self, clerk_id: str, analysis_id: str) -> dict:
        user = self._get_user(clerk_id)

        try:
            analysis_uuid = uuid.UUID(analysis_id)
        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="履歴が見つかりません",
            ) from error

        history = self.job_repo.get_history_detail(user.id, analysis_uuid)
        if not history:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="履歴が見つかりません",
            )

        job_analysis, industry, job_text = history
        return {
            "analysis_id": str(job_analysis.id),
            "job_post_id": str(job_analysis.job_post_id),
            "job_post_title": job_analysis.job_post_title or "タイトル未設定",
            "industry": industry or "未設定",
            "matching_score": job_analysis.matching_score,
            "black_risk_score": job_analysis.black_risk_score,
            "matching_reason": job_analysis.matching_reason,
            "black_risk_reason": job_analysis.black_risk_reason,
            "job_text": job_text or "求人情報は保存されていません",
            "created_at": job_analysis.created_at.isoformat(),
        }
