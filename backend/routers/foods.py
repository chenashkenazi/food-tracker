from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.get("/", response_model=List[schemas.Food])
def get_foods(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    barcode: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Food)
    
    if barcode:
        query = query.filter(models.Food.barcode == barcode)
    elif search:
        query = query.filter(models.Food.name.contains(search))
    
    query = query.filter(
        (models.Food.creator_id == None) | (models.Food.creator_id == current_user.id)
    )
    
    foods = query.offset(skip).limit(limit).all()
    return foods

@router.get("/{food_id}", response_model=schemas.Food)
def get_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    if food.creator_id and food.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this food")
    
    return food

@router.post("/", response_model=schemas.Food)
def create_food(
    food: schemas.FoodCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_food = models.Food(**food.dict(), creator_id=current_user.id)
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

@router.put("/{food_id}", response_model=schemas.Food)
def update_food(
    food_id: int,
    food: schemas.FoodCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not db_food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    if db_food.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this food")
    
    for key, value in food.dict().items():
        setattr(db_food, key, value)
    
    db.commit()
    db.refresh(db_food)
    return db_food

@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not db_food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    if db_food.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this food")
    
    db.delete(db_food)
    db.commit()
    return {"message": "Food deleted successfully"}