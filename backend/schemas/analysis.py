from pydantic import BaseModel;
from pydantic import Field;

class AnalyzeInputData(BaseModel):
    industry: str = Field(..., min_length=1, description="業界を選択してください")
    job_text: str = Field(..., min_length=50, max_length=10000, description="求人情報を入力してください")
