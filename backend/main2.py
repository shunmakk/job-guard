from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
# 各機能のルーターをインポート
# from api.v1.endpoints import users, analysis, history

#移行用のエントリーポイントファイル
load_dotenv()

app = FastAPI(
    title="Job-Guard API",
    description="Automated Risk Evaluation and Analysis Platform",
    version="2.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello World"}

