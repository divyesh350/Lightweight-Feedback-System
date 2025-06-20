from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...api.deps import get_db, get_current_user, require_role
from ...models.user import User, UserRole
from ...schemas.user import UserRead
from typing import List

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/team", response_model=List[UserRead])
def get_team(current_user: User = Depends(require_role(UserRole.manager)), db: Session = Depends(get_db)):
    # Only managers can access this
    team = db.query(User).filter(User.manager_id == current_user.id).all()
    return team
