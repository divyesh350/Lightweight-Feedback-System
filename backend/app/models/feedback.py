from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Boolean, Table
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..db.base import Base

class SentimentEnum(enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    strengths = Column(String, nullable=False)
    areas_to_improve = Column(String, nullable=False)
    sentiment = Column(Enum(SentimentEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    acknowledged = Column(Boolean, default=False)

    manager = relationship("User", foreign_keys=[manager_id], backref="feedback_given")
    employee = relationship("User", foreign_keys=[employee_id], backref="feedback_received")

class FeedbackRequestStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    rejected = "rejected"

class FeedbackRequest(Base):
    __tablename__ = "feedback_request"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=True)
    status = Column(Enum(FeedbackRequestStatus), default=FeedbackRequestStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    requester = relationship("User", foreign_keys=[requester_id], backref="feedback_requests_made")
    target = relationship("User", foreign_keys=[target_id], backref="feedback_requests_received")

class PeerFeedback(Base):
    __tablename__ = "peer_feedback"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    strengths = Column(String, nullable=False)
    areas_to_improve = Column(String, nullable=False)
    sentiment = Column(Enum(SentimentEnum), nullable=False)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    from_user = relationship("User", foreign_keys=[from_user_id], backref="peer_feedback_given")
    to_user = relationship("User", foreign_keys=[to_user_id], backref="peer_feedback_received")

class FeedbackComment(Base):
    __tablename__ = "feedback_comment"

    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)  # markdown
    created_at = Column(DateTime, default=datetime.utcnow)

    feedback = relationship("Feedback", backref="comments")
    user = relationship("User", backref="feedback_comments")

# Association table for many-to-many Feedback <-> Tag
feedback_tag = Table(
    "feedback_tag",
    Base.metadata,
    Column("feedback_id", Integer, ForeignKey("feedback.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tag.id"), primary_key=True)
)

class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    feedbacks = relationship("Feedback", secondary=feedback_tag, backref="tags")

class Notification(Base):
    __tablename__ = "notification"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)  # e.g., 'feedback', 'request', 'comment'
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="notifications")
