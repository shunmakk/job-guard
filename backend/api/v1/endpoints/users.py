from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from auth.clerk_auth import get_current_user
from repositories.user_repository import UserRepository
from schemas.user import (
    UserPreferencesModel,
    UserPreferencesResponse,
    UserRegister,
    UserResponse,
)
from services.user_service import UserService

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_user(
    data: UserRegister,
    payload=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = UserService(UserRepository(db))
    return service.register_user(payload["sub"], data)


@router.post("/preferences", response_model=UserPreferencesResponse)
async def save_preferences(
    data: UserPreferencesModel,
    payload=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = UserService(UserRepository(db))
    return service.save_preferences(payload["sub"], data)
