from fastapi import FastAPI, HTTPException, Request, Depends
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
from model.job_posts import JobPosts
from model.job_analysis_ai import JobAnalysisAI
from sqlalchemy.orm import Session
from app.db import get_db
from model.user_preferences import UserPreferences
import json
import uuid
from datetime import datetime
from version import PROMPT_VERSION


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

########################################################
###ユーザー登録
########################################################
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
    "email": new_user.email,
    "provider": new_user.provider,
    "has_completed_preferences": False
}

########################################################
###求人を元に価値観、希望条件との適合度とブラック企業リスクを評価
########################################################
#業界一覧
VALID_INDUSTRIES = [
    "IT・通信",
    "金融・保険",
    "メーカー・製造",
    "商社",
    "小売・流通",
    "サービス・外食",
    "マスコミ・広告",
    "コンサルティング",
    "不動産・建設",
    "医療・福祉",
    "教育",
    "官公庁・公社・団体",
    "その他",
]

class AnalyzeInputData(BaseModel):
    industry: str = Field(..., min_length=1, description="業界を選択してください")
    job_text: str = Field(..., min_length=50, max_length=10000, description="求人情報を入力してください")
    
    @validator('industry')
    def industry_must_be_valid(cls, v):
        if v not in VALID_INDUSTRIES:
            raise ValueError(f'業界は次のいずれかを選択してください: {", ".join(VALID_INDUSTRIES)}')
        return v
    
    @validator('job_text')
    def job_text_not_empty(cls, v):
        if not v.strip():
            raise ValueError('求人情報は空文字列にできません')
        return v.strip()

# バリデーションエラーのハンドリング
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})



@app.post("/analyze")
async def analyze(
    user_input: AnalyzeInputData,
    payload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    #ClerkでユーザーID取得
    clerk_id = payload["sub"]
    #ユーザーの存在確認
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    #ユーザーの価値観情報を取得
    user_preferences = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not user_preferences:
        raise HTTPException(status_code=400, detail="価値観情報が登録されていません。先に価値観を設定してください。")
    #job_postsにデータを保存
    job_post_id = uuid.uuid4()
    job_post = JobPosts(
        id=job_post_id,
        user_id=user.id,
        industry=user_input.industry,
        job_text=user_input.job_text,
        analysis_status="pending"
    )
    db.add(job_post)
    db.commit()

    try:
        prompt = f"""
あなたは求人情報分析の専門家です。以下の求人情報を分析し、ユーザーの価値観との適合度とブラック企業リスクを評価してください。

## 求人情報
【業界】{user_input.industry}
【求人テキスト】
{user_input.job_text}

## ユーザーの価値観・希望条件
- 年齢層: {user_preferences.age}
- 希望年収: {user_preferences.desired_salary}万円
- 希望休日数: {user_preferences.desired_holiday}日/年
- 許容残業時間: {user_preferences.max_overtime_hours}時間/月
- リモートワーク希望: {user_preferences.remote_preference}
- 働き方スタイル: {user_preferences.work_style}

## 分析タスク
1. **求人テキストから情報を抽出**
   - 給与情報（基本給、賞与、各種手当）
   - 休日・休暇情報
   - 勤務時間・残業情報
   - 福利厚生
   - 仕事内容・求めるスキル
   - 会社の特徴

2. **情報を正規化**
   - 年収レンジの推定
   - 年間休日数の推定
   - 想定残業時間の推定

3. **マッチング度を評価（0-100点）**
   - ユーザーの希望条件との適合度
   - 給与、休日、働き方などの各項目を総合評価

4. **ブラック企業リスクを評価（0-100点）**
   - 低いほど良い（0=ホワイト、100=ブラック）
   - 以下の観点で評価:
     * 曖昧な給与表記（「〜」表記の幅が大きい、固定残業代込みなど）
     * 休日数が少ない・曖昧
     * 残業に関する言及がない/多いことが示唆される
     * 精神論・根性論的な表現
     * 高すぎるインセンティブ依存
     * 離職率や定着率への言及がない
     * 急募・大量募集

## 出力形式（必ずこのJSON形式で出力してください）
{{
    "matching_score": 数値(0-100),
    "matching_reason": "マッチング度の理由を200文字以内で説明。具体的な項目を挙げて説明してください",
    "black_risk_score": 数値(0-100),
    "black_risk_reason": "ブラック企業リスクの理由を200文字以内で説明。具体的な懸念点や良い点を挙げて説明してください"
}}
"""
        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは求人情報を分析し、求職者に有益なアドバイスを提供する専門家です。客観的かつ公平に分析してください。"},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        result_text = res.choices[0].message.content
        result_json = json.loads(result_text)
        matching_score = max(0, min(100, result_json.get("matching_score", 50)))
        black_risk_score = max(0, min(100, result_json.get("black_risk_score", 50)))
        matching_reason = result_json.get("matching_reason", "分析結果を取得できませんでした")
        black_risk_reason = result_json.get("black_risk_reason", "分析結果を取得できませんでした")
        #job_analysis_aiにデータを保存
        job_analysis = JobAnalysisAI(
            id=uuid.uuid4(),
            job_post_id=job_post_id,
            matching_score=matching_score,
            matching_reason=matching_reason,
            black_risk_score=black_risk_score,
            black_risk_reason=black_risk_reason,
            prompt_version=PROMPT_VERSION,
            created_at=datetime.now()
        )
        db.add(job_analysis)

        #job_postのステータスを更新
        job_post.analysis_status = "success"
        job_post.analyzed_at = datetime.now()
        db.commit()
        #フロントエンドに結果を返却
        return {
            "job_post_id": str(job_post_id),
            "matching_score": matching_score,
            "matching_reason": matching_reason,
            "black_risk_score": black_risk_score,
            "black_risk_reason": black_risk_reason
        }
    except json.JSONDecodeError:
        job_post.analysis_status = "failed"
        job_post.analysis_error = "AIの応答をパースできませんでした"
        db.commit()
        raise HTTPException(status_code=500, detail="分析結果の処理中にエラーが発生しました")
    except Exception as e:
        job_post.analysis_status = "failed"
        job_post.analysis_error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"分析中にエラーが発生しました: {str(e)}")



########################################################
###ユーザーの希望条件を取得
########################################################
class UserPreferencesModel(BaseModel):
        desired_salary: int = Field(..., ge=200, le=3000, description="希望年収を入力してください")
        age: str
        desired_holiday: int = Field(..., ge=110, le=150, description="希望休日を入力してください")
        max_overtime_hours: int = Field(..., ge=0, le=80, description="許容残業時間を入力してください")
        remote_preference: str = Field(..., description="在宅可否を入力してください")
        work_style: str = Field(..., description="働き方を入力してください")

@app.post("/users/preferences")
async def save_preferences(
    data: UserPreferencesModel,
    payload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # jwtからclerk_idを取得します
    clerk_id = payload["sub"]

    # userが存在するか
    user = db.query(User).filter(User.clerk_id == clerk_id).first()

    #データベースを更新、なければ作成(（user_id = PKなので1件だけ)
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()

    if pref:
        #更新
        pref.desired_salary = data.desired_holiday
        pref.age = data.age
        pref.desired_holiday = data.desired_holiday
        pref.max_overtime_hours = data.max_overtime_hours
        pref.remote_preference = data.remote_preference
        pref.work_style = data.work_style

    else:
        #作成
        new_pref = UserPreferences(
            user_id=user.id,
            desired_salary=data.desired_salary,
            age=data.age,
            desired_holiday=data.desired_holiday,
            max_overtime_hours=data.max_overtime_hours,
            remote_preference=data.remote_preference,
            work_style=data.work_style
        )
        db.add(new_pref)

        if user.has_completed_preferences is False:
         user.has_completed_preferences = True
        db.commit()

    return {
        "success": True,
        "has_completed_preferences": user.has_completed_preferences
    }

