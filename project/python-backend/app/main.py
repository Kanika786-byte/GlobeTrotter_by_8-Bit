from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
from decouple import config

from app.database import database, engine, metadata
from app.routers import auth, users, destinations, trips, bookings, ai_assistant, maps
from app.middleware.rate_limit import RateLimitMiddleware

# Create tables
metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    yield
    # Shutdown
    await database.disconnect()

app = FastAPI(
    title="Globe Trotter API",
    description="AI-powered travel planning platform with Google Maps integration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config("FRONTEND_URL", default="http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware
app.add_middleware(RateLimitMiddleware)

# Security
security = HTTPBearer()

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Globe Trotter API is running",
        "version": "1.0.0"
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(ai_assistant.router, prefix="/api/ai", tags=["AI Assistant"])
app.include_router(maps.router, prefix="/api/maps", tags=["Maps"])

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=config("ENVIRONMENT", default="development") == "development"
    )