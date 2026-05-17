from pydantic import BaseModel, Field, validator

from core.config import VALID_INDUSTRIES


class AnalyzeInputData(BaseModel):
    industry: str = Field(..., min_length=1, description="業界を選択してください")
    job_text: str = Field(
        ..., min_length=50, max_length=10000, description="求人情報を入力してください"
    )

    @validator("industry")
    def industry_must_be_valid(cls, v):
        if v not in VALID_INDUSTRIES:
            raise ValueError(
                f"業界は次のいずれかを選択してください: {', '.join(VALID_INDUSTRIES)}"
            )
        return v

    @validator("job_text")
    def job_text_not_empty(cls, v):
        if not v.strip():
            raise ValueError("求人情報は空文字列にできません")
        return v.strip()
