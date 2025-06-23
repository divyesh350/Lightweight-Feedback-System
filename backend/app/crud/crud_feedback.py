from sqlalchemy.orm import Session, joinedload
from ..models.feedback import Feedback, SentimentEnum, FeedbackRequest, FeedbackRequestStatus, PeerFeedback, FeedbackComment, Tag, Notification
from ..models.user import User
from ..schemas.feedback import FeedbackCreate, FeedbackUpdate, FeedbackRequestCreate, PeerFeedbackCreate, FeedbackCommentCreate, TagCreate, NotificationCreate
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

def get_feedback_for_manager(db: Session, manager_id: int) -> List[dict]:
    """Get feedback for manager with employee details"""
    feedbacks = db.query(Feedback).filter(Feedback.manager_id == manager_id).order_by(Feedback.created_at.desc()).all()
    
    result = []
    for feedback in feedbacks:
        # Get employee details
        employee = db.query(User).filter(User.id == feedback.employee_id).first()
        
        feedback_dict = {
            "id": feedback.id,
            "manager_id": feedback.manager_id,
            "employee_id": feedback.employee_id,
            "strengths": feedback.strengths,
            "areas_to_improve": feedback.areas_to_improve,
            "sentiment": feedback.sentiment,
            "created_at": feedback.created_at,
            "updated_at": feedback.updated_at,
            "acknowledged": feedback.acknowledged,
            "tags": feedback.tags,
            "employee_name": employee.name if employee else "Unknown Employee",
            "employee_email": employee.email if employee else "unknown@example.com"
        }
        result.append(feedback_dict)
    
    return result

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

# Feedback Request CRUD

def create_feedback_request(db: Session, requester_id: int, request_in: FeedbackRequestCreate) -> FeedbackRequest:
    request = FeedbackRequest(
        requester_id=requester_id,
        target_id=request_in.target_id,
        message=request_in.message,
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

def get_feedback_request_by_id(db: Session, request_id: int) -> Optional[FeedbackRequest]:
    return db.query(FeedbackRequest).filter(FeedbackRequest.id == request_id).first()

def get_feedback_requests_made(db: Session, user_id: int) -> List[FeedbackRequest]:
    return db.query(FeedbackRequest).filter(FeedbackRequest.requester_id == user_id).order_by(FeedbackRequest.created_at.desc()).all()

def get_feedback_requests_received(db: Session, user_id: int) -> List[FeedbackRequest]:
    return db.query(FeedbackRequest).filter(FeedbackRequest.target_id == user_id).order_by(FeedbackRequest.created_at.desc()).all()

def update_feedback_request_status(db: Session, request: FeedbackRequest, status: FeedbackRequestStatus) -> FeedbackRequest:
    request.status = status
    db.commit()
    db.refresh(request)
    return request

# Peer Feedback CRUD

def create_peer_feedback(db: Session, from_user_id: int, feedback_in: PeerFeedbackCreate) -> PeerFeedback:
    feedback = PeerFeedback(
        from_user_id=from_user_id,
        to_user_id=feedback_in.to_user_id,
        strengths=feedback_in.strengths,
        areas_to_improve=feedback_in.areas_to_improve,
        sentiment=feedback_in.sentiment,
        is_anonymous=feedback_in.is_anonymous,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def get_peer_feedback_given(db: Session, user_id: int) -> List[PeerFeedback]:
    return db.query(PeerFeedback).filter(PeerFeedback.from_user_id == user_id).order_by(PeerFeedback.created_at.desc()).all()

def get_peer_feedback_received(db: Session, user_id: int) -> List[PeerFeedback]:
    return db.query(PeerFeedback).filter(PeerFeedback.to_user_id == user_id).order_by(PeerFeedback.created_at.desc()).all()

# Feedback Comment CRUD

def create_feedback_comment(db: Session, feedback_id: int, user_id: int, comment_in: FeedbackCommentCreate) -> FeedbackComment:
    comment = FeedbackComment(
        feedback_id=feedback_id,
        user_id=user_id,
        content=comment_in.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_feedback_comments(db: Session, feedback_id: int) -> List[FeedbackComment]:
    return db.query(FeedbackComment).filter(FeedbackComment.feedback_id == feedback_id).order_by(FeedbackComment.created_at.asc()).all()

# Tag CRUD

def create_tag(db: Session, tag_in: TagCreate) -> Tag:
    tag = Tag(name=tag_in.name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

def get_all_tags(db: Session) -> list[Tag]:
    return db.query(Tag).all()

def add_tag_to_feedback(db: Session, feedback: Feedback, tag: Tag):
    if tag not in feedback.tags:
        feedback.tags.append(tag)
        db.commit()
        db.refresh(feedback)
    return feedback

def remove_tag_from_feedback(db: Session, feedback: Feedback, tag: Tag):
    if tag in feedback.tags:
        feedback.tags.remove(tag)
        db.commit()
        db.refresh(feedback)
    return feedback

def get_tags_for_feedback(db: Session, feedback: Feedback) -> list[Tag]:
    return feedback.tags

# Notification CRUD

def create_notification(db: Session, notification_in: NotificationCreate) -> Notification:
    notification = Notification(
        user_id=notification_in.user_id,
        message=notification_in.message,
        type=notification_in.type
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_notifications_for_user(db: Session, user_id: int) -> list[Notification]:
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

def mark_notification_as_read(db: Session, notification: Notification) -> Notification:
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification

def delete_all_notifications_for_user(db: Session, user_id: int) -> int:
    num_deleted = db.query(Notification).filter(Notification.user_id == user_id).delete()
    db.commit()
    return num_deleted
