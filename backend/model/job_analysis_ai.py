import uuid
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db import Base
from datetime import datetime


class JobAnalysisAI(Base):
    __tablename__ = "job_analysis_ai"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_post_id = Column(PG_UUID(as_uuid=True), ForeignKey("job_posts.id"), index=True)
    matching_score = Column(Integer, nullable=False)
    matching_reason = Column(String, nullable=False)
    black_risk_score = Column(Integer, nullable=False)
    black_risk_reason = Column(String, nullable=False)
    prompt_version = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now, index=True)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)