from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

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

    class Config:
        from_attributes = True

class UserInDB(UserRead):
    hashed_password: str
