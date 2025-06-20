from sqlalchemy.orm import Session
from ..models.feedback import Feedback, SentimentEnum
from ..schemas.feedback import FeedbackCreate, FeedbackUpdate
from typing import List, Optional

def create_feedback(db: Session, manager_id: int, feedback_in: FeedbackCreate) -> Feedback:
    feedback = Feedback(
        manager_id=manager_id,
        employee_id=feedback_in.employee_id,
        strengths=feedback_in.strengths,
        areas_to_improve=feedback_in.areas_to_improve,
        sentiment=feedback_in.sentiment,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def get_feedback_by_id(db: Session, feedback_id: int) -> Optional[Feedback]:
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()

def get_feedback_for_employee(db: Session, employee_id: int) -> List[Feedback]:
    return db.query(Feedback).filter(Feedback.employee_id == employee_id).order_by(Feedback.created_at.desc()).all()

def get_feedback_for_manager(db: Session, manager_id: int) -> List[Feedback]:
    return db.query(Feedback).filter(Feedback.manager_id == manager_id).order_by(Feedback.created_at.desc()).all()

def update_feedback(db: Session, feedback: Feedback, feedback_in: FeedbackUpdate) -> Feedback:
    for field, value in feedback_in.dict(exclude_unset=True).items():
        setattr(feedback, field, value)
    db.commit()
    db.refresh(feedback)
    return feedback

def acknowledge_feedback(db: Session, feedback: Feedback) -> Feedback:
    feedback.acknowledged = True
    db.commit()
    db.refresh(feedback)
    return feedback
