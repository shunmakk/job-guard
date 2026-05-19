from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from auth.clerk_auth import get_current_user
from model.user import User

def get_current_db_user(
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user)
) -> User:
    clerk_id = payload.get("sub")
    if not clerk_id:
        raise HTTPException(
            status_code=401,
            detail="認証トークンにユーザー識別子が含まれていません"
        )
    # 既存のmain.pyで行っていたユーザー検索処理を共通化しました
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=400,
            detail="ユーザー情報が登録されていません"
        )

    return user
