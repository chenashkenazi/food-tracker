# Food Tracking Website

A full-stack food tracking application with Python backend (FastAPI) and TypeScript frontend (React).

## Features

- User authentication and registration
- Food database management
- Meal logging and tracking
- Daily nutrition summaries
- Nutrition goal setting and tracking
- Visual dashboard with charts

## Tech Stack

### Backend
- Python with FastAPI
- SQLAlchemy ORM
- PostgreSQL/SQLite database
- JWT authentication

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation
- Recharts for data visualization

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Run the backend server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
food-tracking-website/
├── backend/
│   ├── routers/          # API route handlers
│   ├── main.py           # FastAPI application entry point
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database configuration
│   ├── auth.py           # Authentication utilities
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application component
│   └── package.json      # Node.js dependencies
└── README.md
```

## Screenshots
<img width="1904" height="933" alt="Screen Shot 2025-08-24 at 14 35 46" src="https://github.com/user-attachments/assets/733a7e3f-c3d5-436d-a98d-6b99c32ebeaf" />
<img width="1904" height="933" alt="Screen Shot 2025-08-24 at 14 36 11" src="https://github.com/user-attachments/assets/338af0a2-d606-4763-8743-7930bfc87e26" />
<img width="1904" height="933" alt="Screen Shot 2025-08-24 at 14 38 19" src="https://github.com/user-attachments/assets/ebf8a234-8da0-439d-b737-36c2a710a098" />

