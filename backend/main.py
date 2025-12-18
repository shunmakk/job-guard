from fastapi import FastAPI, HTTPException, Request,Depends
from pydantic import BaseModel, Field, validator
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import ValidationError
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from auth.clerk_auth import get_current_user
from model.user import User
from sqlalchemy.orm import Session
from app.db import get_db




load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()
security = HTTPBearer()


# CORSを設定
app.add_middleware(
    CORSMiddleware,
    #現段階では全て許可
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "エンドポイント'/'は正常動作しています"}

#ユーザー登録
class UserRegister(BaseModel):
    email: str
    provider: str

@app.post("/users/register")
async def register_user(
    data:UserRegister,
    payload = Depends(get_current_user),
    db: Session = Depends(get_db),):
    clerk_id = payload["sub"]

    #既存のUserテーブルにユーザーが存在するか確認
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if user:
        raise HTTPException(status_code=400, detail="既にユーザーが存在します")

    #新規ユーザーを作成
    new_user = User(
    id=clerk_id,
    clerk_id=clerk_id,
    email=data.email,
    provider=data.provider,
    has_completed_preferences=False
)
    db.add(new_user)
    db.commit()
    return {
    "user_id": new_user.id,
    "has_completed_preferences": False
}


#ユーザーの入力データ(仮)
class UserInputData(BaseModel):
    id: Optional[str] = None
    salary_min: int = Field(..., ge=100, le=3000, description="最低年収を入力してください")
    salary_max: int = Field(..., ge=200, le=9999, description="最高年収を入力してください")
    holiday: int = Field(..., ge=1, le=365, description="年間休日数を入力してください")
    description: str = Field(..., min_length=1, max_length=9999, description="求人の説明を入力してください")
    @validator('salary_max')
    def salary_max_must_be_greater_than_min(cls, v, values):
        if 'salary_min' in values and v <= values['salary_min']:
            raise ValueError('最高年収は最低年収より大きい必要があります')
        return v
    @validator('description')
    def description_not_empty(cls, v):
        if not v.strip():
            raise ValueError('説明は空文字列にできません')
        return v.strip()

#バリデーションエラーのハンドリング
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})
#AI分析
@app.post("/analyze")
async def analyze(user_input: UserInputData):
    if not user_input:
        raise HTTPException(status_code=400, detail="入力が空です。")

    ###promptは要修正
    prompt = f"""
    以下の求人情報から「ブラック企業度」を1〜5段階で評価してください。
    1がブラック企業の可能性が低く、5がブラック企業の可能性が高い。

    【給与範囲】{user_input.salary_min}〜{user_input.salary_max}万円
    【年間休日】{user_input.holiday}日
    【求人文】{user_input.description}

    出力形式（必ずこのJSON形式で出力してください）:
    {user_input.id}が空の場合は"id": null String型で
    {{
        "id": "{user_input.id}" String型,
        "score": 数値 (1〜5) Number型,
        "reason": "理由を100文字以内で説明" String型
    }}
    """
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "あなたは企業文化分析の専門家です。"},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    result_text = res.choices[0].message.content

    import json
    try:
        result_json = json.loads(result_text)
        print(result_json, "成功")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON形式の解析に失敗しました")
        return {
            "id": user_input.id,
                "score": 3,
                "reason": "分析結果の処理中にエラーが発生しました"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        return {
            "id": user_input.id,
                "score": 3,
                "reason": "分析結果の処理中にサーバーエラーが発生しました"
        }

    return result_json