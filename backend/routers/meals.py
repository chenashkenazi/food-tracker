from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.get("/", response_model=List[schemas.Meal])
def get_meals(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    meal_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Meal).filter(models.Meal.user_id == current_user.id)
    
    if start_date:
        query = query.filter(models.Meal.date >= start_date)
    if end_date:
        query = query.filter(models.Meal.date <= end_date)
    if meal_type:
        query = query.filter(models.Meal.meal_type == meal_type)
    
    meals = query.order_by(models.Meal.date.desc()).offset(skip).limit(limit).all()
    return meals

@router.get("/daily-summary/{date}", response_model=schemas.DailyNutritionSummary)
def get_daily_summary(
    date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    meals = db.query(models.Meal).filter(
        models.Meal.user_id == current_user.id,
        models.Meal.date == date
    ).all()
    
    total_calories = 0
    total_protein = 0
    total_carbohydrates = 0
    total_fat = 0
    total_fiber = 0
    total_sugar = 0
    total_sodium = 0
    
    for meal in meals:
        for item in meal.meal_items:
            multiplier = item.quantity
            total_calories += item.food.calories * multiplier
            total_protein += item.food.protein * multiplier
            total_carbohydrates += item.food.carbohydrates * multiplier
            total_fat += item.food.fat * multiplier
            if item.food.fiber:
                total_fiber += item.food.fiber * multiplier
            if item.food.sugar:
                total_sugar += item.food.sugar * multiplier
            if item.food.sodium:
                total_sodium += item.food.sodium * multiplier
    
    goal = db.query(models.NutritionGoal).filter(
        models.NutritionGoal.user_id == current_user.id
    ).order_by(models.NutritionGoal.created_at.desc()).first()
    
    return schemas.DailyNutritionSummary(
        date=date,
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbohydrates=total_carbohydrates,
        total_fat=total_fat,
        total_fiber=total_fiber if total_fiber > 0 else None,
        total_sugar=total_sugar if total_sugar > 0 else None,
        total_sodium=total_sodium if total_sodium > 0 else None,
        goal=goal
    )

@router.get("/{meal_id}", response_model=schemas.Meal)
def get_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    meal = db.query(models.Meal).filter(
        models.Meal.id == meal_id,
        models.Meal.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    return meal

@router.post("/", response_model=schemas.Meal)
def create_meal(
    meal: schemas.MealCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_meal = models.Meal(
        user_id=current_user.id,
        name=meal.name,
        meal_type=meal.meal_type,
        date=meal.date,
        notes=meal.notes
    )
    db.add(db_meal)
    db.flush()
    
    for item in meal.meal_items:
        db_item = models.MealItem(
            meal_id=db_meal.id,
            food_id=item.food_id,
            quantity=item.quantity,
            unit=item.unit
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_meal)
    return db_meal

@router.put("/{meal_id}", response_model=schemas.Meal)
def update_meal(
    meal_id: int,
    meal: schemas.MealCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_meal = db.query(models.Meal).filter(
        models.Meal.id == meal_id,
        models.Meal.user_id == current_user.id
    ).first()
    
    if not db_meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    db_meal.name = meal.name
    db_meal.meal_type = meal.meal_type
    db_meal.date = meal.date
    db_meal.notes = meal.notes
    
    db.query(models.MealItem).filter(models.MealItem.meal_id == meal_id).delete()
    
    for item in meal.meal_items:
        db_item = models.MealItem(
            meal_id=db_meal.id,
            food_id=item.food_id,
            quantity=item.quantity,
            unit=item.unit
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_meal)
    return db_meal

@router.delete("/{meal_id}")
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_meal = db.query(models.Meal).filter(
        models.Meal.id == meal_id,
        models.Meal.user_id == current_user.id
    ).first()
    
    if not db_meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    db.delete(db_meal)
    db.commit()
    return {"message": "Meal deleted successfully"}