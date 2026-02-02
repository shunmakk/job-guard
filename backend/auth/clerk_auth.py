import jwt
import requests
import json
from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

class ClerkJWTAuth:
    def __init__(self):
        # Clerkの公開鍵を取得
        CLERK_ISSUER = os.getenv("CLERK_ISSUER")
        print(CLERK_ISSUER)
        if not CLERK_ISSUER:
            raise ValueError("CLERK_ISSUERが設定されていません")
        self.jwks_url = f"{CLERK_ISSUER}/.well-known/jwks.json"
        if not self.jwks_url:
            raise ValueError("JWKS_URLが設定されていません")

    @lru_cache(maxsize=1)
    def get_jwks(self) -> Dict:
        """Clerkの公開鍵を取得してキャッシュ"""
        try:
            response = requests.get(self.jwks_url)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise HTTPException(
                status_code=500,
                detail=f"JWKS取得エラー: {str(e)}"
            )

    def get_public_key(self, token_header: Dict) -> str:
        #JWTヘッダーからキーIDを取得し、対応する公開鍵を返す
        jwks = self.get_jwks()
        kid = token_header.get("kid")

        for key in jwks["keys"]:
            if key["kid"] == kid:
                return jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))

        raise HTTPException(
            status_code=401,
            detail="適切な公開鍵が見つかりません"
        )

    def verify_token(self, token: str) -> Dict[str, Any]:
        #jwtトークンを検証
        try:
            header = jwt.get_unverified_header(token)
            public_key = self.get_public_key(header)
            # トークンを検証
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"]
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="トークンが期限切れです"
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=401,
                detail=f"無効なトークン: {str(e)}"
            )


clerk_jwt_auth = ClerkJWTAuth()

def get_current_user(credentials = Depends(security)) -> Dict[str, Any]:
    #現在のユーザーを取得
    token = credentials.credentials
    return clerk_jwt_auth.verify_token(token)
