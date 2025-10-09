from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

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
    return {"message": "Hello World"}

#ユーザーの入力データ(仮)
class UserInputData(BaseModel):
    salary_min: int
    salary_max: int
    holidays: int
    description: str

#AI分析
@app.post("/analyze")
async def analyze(user_input: UserInputData):
    if not user_input:
        return {"error": "入力が空です。"}

    ###promptは要修正
    prompt = f"""
    以下の求人情報から「ブラック企業度」を1〜5段階で評価してください。
    1がブラック企業の可能性が低く、5がブラック企業の可能性が高い。

    【給与範囲】{user_input.salary_min}〜{user_input.salary_max}万円
    【年間休日】{user_input.holidays}日
    【求人文】{user_input.description}

    出力形式（必ずこのJSON形式で出力してください）:
    {{
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
        print(result_json "成功")
    except:
        result_json = {"score": 3, "reason": result_text[:200]}  # fallback

    return result_json