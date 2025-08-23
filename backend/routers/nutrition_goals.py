from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.get("/", response_model=List[schemas.NutritionGoal])
def get_nutrition_goals(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    goals = db.query(models.NutritionGoal).filter(
        models.NutritionGoal.user_id == current_user.id
    ).order_by(models.NutritionGoal.created_at.desc()).all()
    return goals

@router.get("/current", response_model=schemas.NutritionGoal)
def get_current_goal(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    goal = db.query(models.NutritionGoal).filter(
        models.NutritionGoal.user_id == current_user.id
    ).order_by(models.NutritionGoal.created_at.desc()).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="No nutrition goals set")
    
    return goal

@router.post("/", response_model=schemas.NutritionGoal)
def create_nutrition_goal(
    goal: schemas.NutritionGoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_goal = models.NutritionGoal(
        user_id=current_user.id,
        **goal.dict()
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.put("/{goal_id}", response_model=schemas.NutritionGoal)
def update_nutrition_goal(
    goal_id: int,
    goal: schemas.NutritionGoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_goal = db.query(models.NutritionGoal).filter(
        models.NutritionGoal.id == goal_id,
        models.NutritionGoal.user_id == current_user.id
    ).first()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Nutrition goal not found")
    
    for key, value in goal.dict().items():
        setattr(db_goal, key, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}")
def delete_nutrition_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_goal = db.query(models.NutritionGoal).filter(
        models.NutritionGoal.id == goal_id,
        models.NutritionGoal.user_id == current_user.id
    ).first()
    
    if not db_goal:
        raise HTTPException(status_code=404, detail="Nutrition goal not found")
    
    db.delete(db_goal)
    db.commit()
    return {"message": "Nutrition goal deleted successfully"}