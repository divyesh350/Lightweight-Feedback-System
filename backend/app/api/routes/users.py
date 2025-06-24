from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...db.session import SessionLocal
from ...crud import crud_user
from ...schemas.user import UserRead, UserCreate, TeamMemberAdd, TeamMemberRemove
from ...api.deps import get_db, get_current_user
from ...models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/managers", response_model=List[UserRead])
def get_managers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all managers that can be requested for feedback"""
    managers = crud_user.get_managers(db)
    return managers

@router.get("/team", response_model=List[UserRead])
def get_team_members(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all team members for the current manager"""
    if current_user.role.value != "manager":
        raise HTTPException(status_code=403, detail="Only managers can view team members")
    
    team_members = crud_user.get_team_members(db, manager_id=current_user.id)
    return team_members

@router.get("/available-employees", response_model=List[UserRead])
def get_available_employees(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all employees who are not assigned to any manager"""
    if current_user.role.value != "manager":
        raise HTTPException(status_code=403, detail="Only managers can view available employees")
    
    available_employees = crud_user.get_available_employees(db)
    return available_employees

@router.post("/team/add", response_model=UserRead)
def add_team_member(
    team_data: TeamMemberAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add an employee to the current manager's team"""
    if current_user.role.value != "manager":
        raise HTTPException(status_code=403, detail="Only managers can add team members")
    
    # Check if employee exists and is not already assigned
    employee = crud_user.get_user_by_id(db, team_data.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if employee.role.value != "employee":
        raise HTTPException(status_code=400, detail="Can only add employees to team")
    
    if employee.manager_id is not None:
        raise HTTPException(status_code=400, detail="Employee is already assigned to a manager")
    
    # Add employee to team
    updated_employee = crud_user.assign_employee_to_manager(db, employee_id=team_data.employee_id, manager_id=current_user.id)
    return updated_employee

@router.delete("/team/remove/{employee_id}")
def remove_team_member(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove an employee from the current manager's team"""
    if current_user.role.value != "manager":
        raise HTTPException(status_code=403, detail="Only managers can remove team members")
    
    # Check if employee is in current manager's team
    employee = crud_user.get_user_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if employee.manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="Employee is not in your team")
    
    # Remove employee from team
    crud_user.remove_employee_from_manager(db, employee_id=employee_id)
    return {"message": "Employee removed from team successfully"}

@router.get("/all", response_model=List[UserRead])
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all users (for peer feedback selection)"""
    users = crud_user.get_users(db)
    return users
