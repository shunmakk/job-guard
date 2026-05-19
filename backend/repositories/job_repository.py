import uuid
from datetime import datetime

from sqlalchemy import desc
from sqlalchemy.orm import Session

from model.job_analysis_ai import JobAnalysisAI
from model.job_posts import JobPosts
from model.user_preferences import UserPreferences
from version import PROMPT_VERSION


class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_job_post(
        self, user_id: str, industry: str, job_text: str
    ) -> tuple[JobPosts, uuid.UUID]:
        job_post_id = uuid.uuid4()
        job_post = JobPosts(
            id=job_post_id,
            user_id=user_id,
            industry=industry,
            job_text=job_text,
            analysis_status="pending",
        )
        self.db.add(job_post)
        self.db.commit()
        return job_post, job_post_id

    def mark_job_failed(self, job_post: JobPosts, error: str) -> None:
        job_post.analysis_status = "failed"
        job_post.analysis_error = error
        self.db.commit()

    def save_analysis_result(
        self,
        job_post: JobPosts,
        user_id: str,
        job_post_id: uuid.UUID,
        job_post_title: str,
        matching_score: int,
        matching_reason: str,
        black_risk_score: int,
        black_risk_reason: str,
    ) -> JobAnalysisAI:
        job_analysis = JobAnalysisAI(
            id=uuid.uuid4(),
            user_id=user_id,
            job_post_id=job_post_id,
            job_post_title=job_post_title,
            matching_score=matching_score,
            matching_reason=matching_reason,
            black_risk_score=black_risk_score,
            black_risk_reason=black_risk_reason,
            prompt_version=PROMPT_VERSION,
            created_at=datetime.now(),
        )
        self.db.add(job_analysis)
        job_post.analysis_status = "success"
        job_post.analyzed_at = datetime.now()
        self.db.commit()
        return job_analysis

    def get_user_preferences(self, user_id: str) -> UserPreferences | None:
        return (
            self.db.query(UserPreferences)
            .filter(UserPreferences.user_id == user_id)
            .first()
        )

    def get_histories(self, user_id: str, limit: int = 20):
        return (
            self.db.query(JobAnalysisAI, JobPosts.industry)
            .outerjoin(JobPosts, JobAnalysisAI.job_post_id == JobPosts.id)
            .filter(JobAnalysisAI.user_id == user_id)
            .order_by(desc(JobAnalysisAI.created_at))
            .limit(limit)
            .all()
        )

    def get_history_detail(self, user_id: str, analysis_id: uuid.UUID):
        return (
            self.db.query(JobAnalysisAI, JobPosts.industry, JobPosts.job_text)
            .outerjoin(JobPosts, JobAnalysisAI.job_post_id == JobPosts.id)
            .filter(
                JobAnalysisAI.user_id == user_id,
                JobAnalysisAI.id == analysis_id,
            )
            .first()
        )
