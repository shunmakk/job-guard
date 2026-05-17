from fastapi import HTTPException, status

from repositories.user_repository import UserRepository
from schemas.user import UserPreferencesModel, UserRegister


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(self, clerk_id: str, data: UserRegister) -> dict:
        if self.user_repo.get_by_clerk_id(clerk_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="既にユーザーが存在します",
            )

        new_user = self.user_repo.create(clerk_id, data)
        return {
            "email": new_user.email,
            "provider": new_user.provider,
            "has_completed_preferences": new_user.has_completed_preferences,
        }

    def save_preferences(self, clerk_id: str, data: UserPreferencesModel) -> dict:
        user = self.user_repo.get_by_clerk_id(clerk_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ユーザーが見つかりません",
            )

        self.user_repo.upsert_preferences(user, data)
        return {
            "success": True,
            "has_completed_preferences": user.has_completed_preferences,
        }
