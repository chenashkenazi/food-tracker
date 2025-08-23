from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class FoodBase(BaseModel):
    name: str
    brand: Optional[str] = None
    barcode: Optional[str] = None
    serving_size: float
    serving_unit: str
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None

class FoodCreate(FoodBase):
    pass

class Food(FoodBase):
    id: int
    creator_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class MealItemBase(BaseModel):
    food_id: int
    quantity: float
    unit: str

class MealItemCreate(MealItemBase):
    pass

class MealItem(MealItemBase):
    id: int
    food: Food
    
    class Config:
        from_attributes = True

class MealBase(BaseModel):
    name: str
    meal_type: str
    date: date
    notes: Optional[str] = None

class MealCreate(MealBase):
    meal_items: List[MealItemCreate]

class Meal(MealBase):
    id: int
    user_id: int
    meal_items: List[MealItem]
    created_at: datetime
    
    class Config:
        from_attributes = True

class NutritionGoalBase(BaseModel):
    daily_calories: float
    daily_protein: float
    daily_carbohydrates: float
    daily_fat: float
    daily_fiber: Optional[float] = None
    daily_sugar: Optional[float] = None
    daily_sodium: Optional[float] = None

class NutritionGoalCreate(NutritionGoalBase):
    pass

class NutritionGoal(NutritionGoalBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DailyNutritionSummary(BaseModel):
    date: date
    total_calories: float
    total_protein: float
    total_carbohydrates: float
    total_fat: float
    total_fiber: Optional[float]
    total_sugar: Optional[float]
    total_sodium: Optional[float]
    goal: Optional[NutritionGoal]