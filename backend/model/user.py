from sqlalchemy import Column, Integer, String, DateTime
from app.db import Base

class User(Base):
    _tabelname_ = "users"

    id = Column(String, primary_key=True ,index=True)
    clerk_id = Column(String, index=True)
    email = Column(String, index=True)
    provider = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)