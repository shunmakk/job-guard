from sqlalchemy import Column, Integer, String, DateTime
from app.db import Base
from datetime import datetime

class UserPrefrences(Base):
    __tablename__ = "user_preferences"

    user_id = Column(String, ForeignKey("users.id"), index=True)
    age = Column(Integer, index=True)
    desired_salary = Column(Integer, index=True)
    desired_holdiy = Column(Integer, index=True)
    max_overtime_hours = Column(Integer, index=True)
    remote_preference = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
