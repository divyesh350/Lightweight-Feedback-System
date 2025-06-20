from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...api.deps import get_db, get_current_user, require_role
from ...models.user import User, UserRole
from ...models.feedback import Feedback
from ...schemas.feedback import FeedbackCreate, FeedbackRead, FeedbackUpdate
from ...crud import crud_feedback
from typing import List

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

@router.post("/", response_model=FeedbackRead)
def create_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    feedback = crud_feedback.create_feedback(db, manager_id=current_user.id, feedback_in=feedback_in)
    return feedback

@router.get("/employee", response_model=List[FeedbackRead])
def get_my_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return crud_feedback.get_feedback_for_employee(db, employee_id=current_user.id)

@router.get("/manager", response_model=List[FeedbackRead])
def get_team_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    return crud_feedback.get_feedback_for_manager(db, manager_id=current_user.id)

@router.patch("/{feedback_id}", response_model=FeedbackRead)
def update_feedback(
    feedback_id: int,
    feedback_in: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    feedback = crud_feedback.get_feedback_by_id(db, feedback_id)
    if not feedback or feedback.manager_id != current_user.id:
        raise HTTPException(status_code=404, detail="Feedback not found or not permitted")
    return crud_feedback.update_feedback(db, feedback, feedback_in)

@router.post("/{feedback_id}/acknowledge", response_model=FeedbackRead)
def acknowledge_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    feedback = crud_feedback.get_feedback_by_id(db, feedback_id)
    if not feedback or feedback.employee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Feedback not found or not permitted")
    return crud_feedback.acknowledge_feedback(db, feedback)
