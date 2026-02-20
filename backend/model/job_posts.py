import uuid
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db import Base
from datetime import datetime


class JobPosts(Base):
    __tablename__ = "job_posts"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.id"))
    job_title = Column(String, nullable=True)
    industry = Column(String, nullable=False)
    job_text = Column(String, nullable=False)
    analysis_status = Column(String, default="pending")  # "pending" | "success" | "failed"
    analysis_error = Column(String, nullable=True)       # 失敗理由
    analyzed_at = Column(DateTime,default=datetime.now, index=True, nullable=True)
