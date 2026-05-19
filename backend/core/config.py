import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
