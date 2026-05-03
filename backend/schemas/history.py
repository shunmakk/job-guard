from pydantic import BaseModel
from pydantic import Optional

class JobMyPageHistoryDetailResponse(BaseModel):
    analysis_id: str
    job_post_id: str
    job_post_title: str
    industry: str
    matching_score: int
    black_risk_score: int
    matching_reason: str
    created_at: str
    black_risk_reason: str
    job_text: str


class JobMyPageUserInfoResponse(BaseModel):
    desired_salary: Optional[int] = None
    age: Optional[str] = None
    desired_holiday: Optional[int] = None
    max_overtime_hours: Optional[int] = None
    remote_preference: Optional[str] = None
    work_style: Optional[str] = None


class JobMyPageHistoryResponse(BaseModel):
    user_info: JobMyPageUserInfoResponse
    analysis_id: str
    job_post_id: str
    job_post_title: str
    industry: str
    matching_score: int
    black_risk_score: int
    matching_reason: str
    created_at: str