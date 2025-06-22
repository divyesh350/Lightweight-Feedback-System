from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from ...api.deps import get_db, get_current_user, require_role
from ...models.user import User, UserRole
from ...models.feedback import Feedback
from ...schemas.feedback import FeedbackCreate, FeedbackRead, FeedbackReadWithEmployee, FeedbackUpdate, FeedbackRequestCreate, FeedbackRequestRead, FeedbackRequestStatus, PeerFeedbackCreate, PeerFeedbackRead, FeedbackCommentCreate, FeedbackCommentRead, TagCreate, TagRead, NotificationRead, NotificationCreate
from ...crud import crud_feedback
from ...crud.crud_feedback import (
    create_feedback_request,
    get_feedback_requests_made,
    get_feedback_requests_received,
    get_feedback_request_by_id,
    update_feedback_request_status,
    create_peer_feedback,
    get_peer_feedback_given,
    get_peer_feedback_received,
    create_feedback_comment,
    get_feedback_comments,
    create_tag,
    get_all_tags,
    add_tag_to_feedback,
    remove_tag_from_feedback,
    get_notifications_for_user,
    mark_notification_as_read,
    create_notification
)
from typing import List
from ...core.config import send_email_background
from fastapi.responses import StreamingResponse
from fpdf import FPDF
import io

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

@router.post("/", response_model=FeedbackRead)
def create_feedback(
    feedback_in: FeedbackCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager)),
):
    feedback = crud_feedback.create_feedback(db, manager_id=current_user.id, feedback_in=feedback_in)
    # Notify employee (in-app)
    notification = NotificationCreate(
        user_id=feedback.employee_id,
        message=f"You have received new feedback from your manager.",
        type="feedback"
    )
    create_notification(db, notification)
    # Send email to employee
    employee = db.query(User).filter(User.id == feedback.employee_id).first()
    if employee:
        send_email_background(
            background_tasks,
            to_email=employee.email,
            subject="New Feedback Received",
            body=f"<p>You have received new feedback from your manager.</p>"
        )
    return feedback

@router.get("/employee", response_model=List[FeedbackRead])
def get_my_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return crud_feedback.get_feedback_for_employee(db, employee_id=current_user.id)

@router.get("/manager", response_model=List[FeedbackReadWithEmployee])
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

# Feedback Request Endpoints
@router.post("/request", response_model=FeedbackRequestRead)
def request_feedback(
    request_in: FeedbackRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return create_feedback_request(db, requester_id=current_user.id, request_in=request_in)

@router.get("/requests/made", response_model=List[FeedbackRequestRead])
def list_feedback_requests_made(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return get_feedback_requests_made(db, user_id=current_user.id)

@router.get("/requests/received", response_model=List[FeedbackRequestRead])
def list_feedback_requests_received(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    return get_feedback_requests_received(db, user_id=current_user.id)

@router.patch("/request/{request_id}/status", response_model=FeedbackRequestRead)
def update_feedback_request_status_endpoint(
    request_id: int,
    status: FeedbackRequestStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    request = get_feedback_request_by_id(db, request_id)
    if not request or request.target_id != current_user.id:
        raise HTTPException(status_code=404, detail="Request not found or not permitted")
    return update_feedback_request_status(db, request, status)

# Peer Feedback Endpoints
@router.post("/peer", response_model=PeerFeedbackRead)
def create_peer_feedback_endpoint(
    feedback_in: PeerFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return create_peer_feedback(db, from_user_id=current_user.id, feedback_in=feedback_in)

@router.get("/peer/given", response_model=List[PeerFeedbackRead])
def list_peer_feedback_given(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    return get_peer_feedback_given(db, user_id=current_user.id)

@router.get("/peer/received", response_model=List[PeerFeedbackRead])
def list_peer_feedback_received(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    feedbacks = get_peer_feedback_received(db, user_id=current_user.id)
    # Hide from_user_id if is_anonymous
    for fb in feedbacks:
        if fb.is_anonymous:
            fb.from_user_id = None
    return feedbacks

# Feedback Comment Endpoints
@router.post("/{feedback_id}/comments", response_model=FeedbackCommentRead)
def add_feedback_comment(
    feedback_id: int,
    comment_in: FeedbackCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_feedback_comment(db, feedback_id=feedback_id, user_id=current_user.id, comment_in=comment_in)

@router.get("/{feedback_id}/comments", response_model=List[FeedbackCommentRead])
def list_feedback_comments(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_feedback_comments(db, feedback_id=feedback_id)

# Tag Endpoints
@router.post("/tags", response_model=TagRead)
def create_tag_endpoint(
    tag_in: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    return create_tag(db, tag_in=tag_in)

@router.get("/tags", response_model=list[TagRead])
def list_tags_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_tags(db)

@router.post("/{feedback_id}/tags/{tag_id}", response_model=TagRead)
def add_tag_to_feedback_endpoint(
    feedback_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    feedback = crud_feedback.get_feedback_by_id(db, feedback_id)
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not feedback or not tag:
        raise HTTPException(status_code=404, detail="Feedback or tag not found")
    add_tag_to_feedback(db, feedback, tag)
    return tag

@router.delete("/{feedback_id}/tags/{tag_id}", response_model=TagRead)
def remove_tag_from_feedback_endpoint(
    feedback_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.manager))
):
    feedback = crud_feedback.get_feedback_by_id(db, feedback_id)
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not feedback or not tag:
        raise HTTPException(status_code=404, detail="Feedback or tag not found")
    remove_tag_from_feedback(db, feedback, tag)
    return tag

# Notification Endpoints
@router.get("/notifications", response_model=list[NotificationRead])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_notifications_for_user(db, user_id=current_user.id)

@router.post("/notifications/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return mark_notification_as_read(db, notification)

@router.get("/employee/pdf")
def export_feedback_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.employee))
):
    feedbacks = crud_feedback.get_feedback_for_employee(db, employee_id=current_user.id)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Feedback Report for {current_user.name}", ln=True, align="C")
    pdf.ln(10)
    for fb in feedbacks:
        pdf.multi_cell(0, 10, txt=f"Date: {fb.created_at.strftime('%Y-%m-%d %H:%M')}\nStrengths: {fb.strengths}\nAreas to Improve: {fb.areas_to_improve}\nSentiment: {fb.sentiment.value}\nAcknowledged: {fb.acknowledged}\n---", align="L")
        pdf.ln(2)
    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return StreamingResponse(pdf_output, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=feedback_{current_user.id}.pdf"})
