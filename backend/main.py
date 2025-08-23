from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from database import engine, Base
from routers import auth, foods, meals, nutrition_goals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Tracking API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(foods.router, prefix="/api/foods", tags=["Foods"])
app.include_router(meals.router, prefix="/api/meals", tags=["Meals"])
app.include_router(nutrition_goals.router, prefix="/api/goals", tags=["Nutrition Goals"])

@app.get("/")
def read_root():
    return {"message": "Food Tracking API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)