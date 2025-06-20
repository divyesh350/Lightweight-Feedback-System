from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Boolean
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
