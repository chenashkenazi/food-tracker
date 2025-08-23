from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    meals = relationship("Meal", back_populates="user")
    nutrition_goals = relationship("NutritionGoal", back_populates="user")
    custom_foods = relationship("Food", back_populates="creator")

class Food(Base):
    __tablename__ = "foods"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, nullable=True)
    barcode = Column(String, nullable=True, index=True)
    serving_size = Column(Float)
    serving_unit = Column(String)
    calories = Column(Float)
    protein = Column(Float)
    carbohydrates = Column(Float)
    fat = Column(Float)
    fiber = Column(Float, nullable=True)
    sugar = Column(Float, nullable=True)
    sodium = Column(Float, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    creator = relationship("User", back_populates="custom_foods")
    meal_items = relationship("MealItem", back_populates="food")

class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    meal_type = Column(String)
    date = Column(Date)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="meals")
    meal_items = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")

class MealItem(Base):
    __tablename__ = "meal_items"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))
    quantity = Column(Float)
    unit = Column(String)
    
    meal = relationship("Meal", back_populates="meal_items")
    food = relationship("Food", back_populates="meal_items")

class NutritionGoal(Base):
    __tablename__ = "nutrition_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    daily_calories = Column(Float)
    daily_protein = Column(Float)
    daily_carbohydrates = Column(Float)
    daily_fat = Column(Float)
    daily_fiber = Column(Float, nullable=True)
    daily_sugar = Column(Float, nullable=True)
    daily_sodium = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="nutrition_goals")