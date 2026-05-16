from pydantic import BaseModel
from pydantic import Field

class UserRegister(BaseModel):
    email: str
    provider: str

class UserPreferencesModel(BaseModel):
        desired_salary: int = Field(..., ge=200, le=3000, description="希望年収を入力してください")
        age: str
        desired_holiday: int = Field(..., ge=110, le=150, description="希望休日を入力してください")
        max_overtime_hours: int = Field(..., ge=0, le=80, description="許容残業時間を入力してください")
        remote_preference: str = Field(..., description="在宅可否を入力してください")
        work_style: str = Field(..., description="働き方を入力してください")

class UserResponse(BaseModel):
    email: str
    provider: str
    has_completed_preferences: bool