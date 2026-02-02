from sqlalchemy import Column, Integer, String, DateTime, ForeignKey  # pyright: ignore[reportMissingImports]
from app.db import Base
from datetime import datetime,timezone

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    #user_preferencesは1ユーザーにつき1つしか存在しないため、主キーをuser_idとする
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    age = Column(String, index=True)
    desired_salary = Column(Integer, index=True)
    desired_holiday = Column(Integer, index=True)
    max_overtime_hours = Column(Integer, index=True)
    remote_preference = Column(String, nullable=False,index=True)
    work_style = Column(String, nullable=False,index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
