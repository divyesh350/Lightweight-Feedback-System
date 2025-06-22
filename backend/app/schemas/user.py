from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    manager = "manager"
    employee = "employee"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    manager_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    manager_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserInDB(UserRead):
    hashed_password: str

class TeamMemberAdd(BaseModel):
    employee_id: int

class TeamMemberRemove(BaseModel):
    employee_id: int
