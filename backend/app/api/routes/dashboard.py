from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from ...api.deps import get_db, get_current_user, require_role
from ...models.user import User, UserRole
from ...models.feedback import Feedback, SentimentEnum
from ...schemas.feedback import FeedbackRead
from ...crud import crud_feedback
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/manager/overview")
def get_manager_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    """Get overview statistics for manager dashboard"""
    # Get total feedback count
    total_feedback = db.query(func.count(Feedback.id)).filter(
        Feedback.manager_id == current_user.id
    ).scalar()
    
    # Get sentiment distribution
    sentiment_counts = db.query(
        Feedback.sentiment,
        func.count(Feedback.id)
    ).filter(
        Feedback.manager_id == current_user.id
    ).group_by(Feedback.sentiment).all()
    
    # Calculate percentages
    positive_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.positive), 0)
    neutral_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.neutral), 0)
    negative_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.negative), 0)
    
    positive_percentage = round((positive_count / total_feedback * 100) if total_feedback > 0 else 0, 1)
    neutral_percentage = round((neutral_count / total_feedback * 100) if total_feedback > 0 else 0, 1)
    negative_percentage = round((negative_count / total_feedback * 100) if total_feedback > 0 else 0, 1)
    
    return {
        "total_feedback": total_feedback,
        "positive_percentage": positive_percentage,
        "neutral_percentage": neutral_percentage,
        "negative_percentage": negative_percentage,
        "positive_count": positive_count,
        "neutral_count": neutral_count,
        "negative_count": negative_count
    }

@router.get("/manager/sentiment_trends")
def get_manager_sentiment_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    """Get sentiment trends over time for manager dashboard"""
    # This would typically group by month/period
    # For now, return sample data
    return [
        {"month": "Jan", "positive": 25, "neutral": 8, "negative": 5},
        {"month": "Feb", "positive": 32, "neutral": 10, "negative": 4},
        {"month": "Mar", "positive": 35, "neutral": 6, "negative": 3},
        {"month": "Apr", "positive": 38, "neutral": 8, "negative": 2},
    ]

@router.get("/manager/team-member-stats/{employee_id}")
def get_team_member_stats(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    """Get feedback statistics for a specific team member"""
    # Verify the employee is in the manager's team
    employee = db.query(User).filter(
        User.id == employee_id,
        User.manager_id == current_user.id
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found in your team")
    
    # Get feedback statistics for this employee
    total_feedback = db.query(func.count(Feedback.id)).filter(
        Feedback.employee_id == employee_id,
        Feedback.manager_id == current_user.id
    ).scalar()
    
    # Get sentiment distribution
    sentiment_counts = db.query(
        Feedback.sentiment,
        func.count(Feedback.id)
    ).filter(
        Feedback.employee_id == employee_id,
        Feedback.manager_id == current_user.id
    ).group_by(Feedback.sentiment).all()
    
    # Calculate percentages
    positive_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.positive), 0)
    neutral_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.neutral), 0)
    negative_count = next((count for sentiment, count in sentiment_counts if sentiment == SentimentEnum.negative), 0)
    
    # Get acknowledgment count
    acknowledged_count = db.query(func.count(Feedback.id)).filter(
        Feedback.employee_id == employee_id,
        Feedback.manager_id == current_user.id,
        Feedback.acknowledged == True
    ).scalar()
    
    # Calculate satisfaction score (positive percentage)
    satisfaction_score = round((positive_count / total_feedback * 100) if total_feedback > 0 else 0, 1)
    
    return {
        "employee_id": employee_id,
        "employee_name": employee.name,
        "employee_email": employee.email,
        "total_feedback": total_feedback,
        "acknowledged_feedback": acknowledged_count,
        "positive_feedback": positive_count,
        "neutral_feedback": neutral_count,
        "negative_feedback": negative_count,
        "satisfaction_score": satisfaction_score,
        "positive_percentage": round((positive_count / total_feedback * 100) if total_feedback > 0 else 0, 1),
        "neutral_percentage": round((neutral_count / total_feedback * 100) if total_feedback > 0 else 0, 1),
        "negative_percentage": round((negative_count / total_feedback * 100) if total_feedback > 0 else 0, 1)
    }

@router.get("/employee/timeline", response_model=List[FeedbackRead])
def get_employee_timeline(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    """Get feedback timeline for employee dashboard"""
    feedbacks = db.query(Feedback).filter(
        Feedback.employee_id == current_user.id
    ).order_by(Feedback.created_at.desc()).all()
    
    return feedbacks
