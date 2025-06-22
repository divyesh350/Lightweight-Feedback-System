from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class SentimentEnum(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagRead(TagBase):
    id: int
    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    strengths: str
    areas_to_improve: str
    sentiment: SentimentEnum

class FeedbackCreate(FeedbackBase):
    employee_id: int

class FeedbackUpdate(BaseModel):
    strengths: Optional[str] = None
    areas_to_improve: Optional[str] = None
    sentiment: Optional[SentimentEnum] = None
    acknowledged: Optional[bool] = None

class FeedbackRead(FeedbackBase):
    id: int
    manager_id: int
    employee_id: int
    created_at: datetime
    updated_at: datetime
    acknowledged: bool
    tags: list[TagRead] = []

    class Config:
        from_attributes = True

class FeedbackReadWithEmployee(FeedbackRead):
    employee_name: str
    employee_email: str

    class Config:
        from_attributes = True

class FeedbackRequestStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    rejected = "rejected"

class FeedbackRequestBase(BaseModel):
    target_id: int
    message: Optional[str] = None

class FeedbackRequestCreate(FeedbackRequestBase):
    pass

class FeedbackRequestRead(FeedbackRequestBase):
    id: int
    requester_id: int
    status: FeedbackRequestStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PeerFeedbackBase(BaseModel):
    to_user_id: int
    strengths: str
    areas_to_improve: str
    sentiment: SentimentEnum
    is_anonymous: bool = False

class PeerFeedbackCreate(PeerFeedbackBase):
    pass

class PeerFeedbackRead(PeerFeedbackBase):
    id: int
    from_user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FeedbackCommentBase(BaseModel):
    content: str  # markdown

class FeedbackCommentCreate(FeedbackCommentBase):
    pass

class FeedbackCommentRead(FeedbackCommentBase):
    id: int
    feedback_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    message: str
    type: str

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationRead(NotificationBase):
    id: int
    user_id: int
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
