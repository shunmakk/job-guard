from sqlalchemy.orm import Session

from model.user import User
from model.user_preferences import UserPreferences
from schemas.user import UserPreferencesModel, UserRegister


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_clerk_id(self, clerk_id: str) -> User | None:
        return self.db.query(User).filter(User.clerk_id == clerk_id).first()

    def create(self, clerk_id: str, data: UserRegister) -> User:
        new_user = User(
            id=clerk_id,
            clerk_id=clerk_id,
            email=data.email,
            provider=data.provider,
            has_completed_preferences=False,
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_preferences(self, user_id: str) -> UserPreferences | None:
        return (
            self.db.query(UserPreferences)
            .filter(UserPreferences.user_id == user_id)
            .first()
        )

    def upsert_preferences(
        self, user: User, data: UserPreferencesModel
    ) -> UserPreferences:
        pref = self.get_preferences(user.id)

        if pref:
            pref.desired_salary = data.desired_salary
            pref.age = data.age
            pref.desired_holiday = data.desired_holiday
            pref.max_overtime_hours = data.max_overtime_hours
            pref.remote_preference = data.remote_preference
            pref.work_style = data.work_style
        else:
            pref = UserPreferences(
                user_id=user.id,
                desired_salary=data.desired_salary,
                age=data.age,
                desired_holiday=data.desired_holiday,
                max_overtime_hours=data.max_overtime_hours,
                remote_preference=data.remote_preference,
                work_style=data.work_style,
            )
            self.db.add(pref)
            if not user.has_completed_preferences:
                user.has_completed_preferences = True

        self.db.commit()
        self.db.refresh(user)
        return pref
