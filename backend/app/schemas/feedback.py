from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class SentimentEnum(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

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

    class Config:
        from_attributes = True
