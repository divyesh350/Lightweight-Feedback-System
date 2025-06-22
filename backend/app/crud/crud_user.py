from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from ..core.security import get_password_hash, verify_password

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        role=user.role,
        manager_id=user.manager_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Team Management Functions
def get_team_members(db: Session, manager_id: int):
    """Get all team members for a specific manager"""
    return db.query(User).filter(User.manager_id == manager_id).all()

def get_available_employees(db: Session):
    """Get all employees who are not assigned to any manager"""
    return db.query(User).filter(
        User.role == "employee",
        User.manager_id.is_(None)
    ).all()

def assign_employee_to_manager(db: Session, employee_id: int, manager_id: int):
    """Assign an employee to a manager"""
    employee = get_user_by_id(db, employee_id)
    if employee:
        employee.manager_id = manager_id
        db.commit()
        db.refresh(employee)
    return employee

def remove_employee_from_manager(db: Session, employee_id: int):
    """Remove an employee from their current manager"""
    employee = get_user_by_id(db, employee_id)
    if employee:
        employee.manager_id = None
        db.commit()
        db.refresh(employee)
    return employee
