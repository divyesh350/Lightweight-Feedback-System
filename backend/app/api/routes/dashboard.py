from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from ...api.deps import get_db, get_current_user, require_role
from ...models.user import User, UserRole
from ...models.feedback import Feedback, SentimentEnum
from ...schemas.feedback import FeedbackRead
from typing import List, Dict
from datetime import datetime

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/manager/overview")
def manager_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    # Feedback count per team member
    team = db.query(User).filter(User.manager_id == current_user.id).all()
    feedback_counts = {}
    for member in team:
        count = db.query(func.count(Feedback.id)).filter(Feedback.employee_id == member.id).scalar()
        feedback_counts[member.id] = {
            "name": member.name,
            "feedback_count": count
        }
    return {"team_feedback_counts": feedback_counts}

@router.get("/manager/sentiment_trends")
def sentiment_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    # Sentiment trend per month for manager's team
    current_year = datetime.utcnow().year
    sentiments = db.query(
        extract('month', Feedback.created_at).label('month'),
        Feedback.sentiment,
        func.count(Feedback.id)
    ).join(User, Feedback.employee_id == User.id)
    sentiments = sentiments.filter(User.manager_id == current_user.id)
    sentiments = sentiments.filter(extract('year', Feedback.created_at) == current_year)
    sentiments = sentiments.group_by('month', Feedback.sentiment).all()
    # Format: {month: {sentiment: count}}
    result = {}
    for month, sentiment, count in sentiments:
        month = int(month)
        if month not in result:
            result[month] = {s.value: 0 for s in SentimentEnum}
        result[month][sentiment.value] = count
    return {"sentiment_trends": result}

@router.get("/employee/timeline", response_model=List[FeedbackRead])
def employee_timeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    feedbacks = db.query(Feedback).filter(Feedback.employee_id == current_user.id).order_by(Feedback.created_at.desc()).all()
    return feedbacks
