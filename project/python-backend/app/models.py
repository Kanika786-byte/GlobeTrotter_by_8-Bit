from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    google_id: Optional[str] = None
    profile_image_url: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    travel_preferences: Optional[Dict[str, Any]] = None

class User(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    profile_image_url: Optional[str] = None
    is_active: bool
    travel_preferences: Optional[Dict[str, Any]] = None
    created_at: datetime

# Destination Models
class DestinationCreate(BaseModel):
    name: str
    city: str
    country: str
    continent: str
    latitude: float
    longitude: float
    description: str
    short_description: str
    average_price: float
    currency: str = "USD"
    safety_index: int = 50
    avg_temperature: Optional[float] = None
    activity_categories: List[str] = []
    image_url: Optional[str] = None

class Destination(BaseModel):
    id: str
    name: str
    city: str
    country: str
    continent: str
    latitude: float
    longitude: float
    description: str
    short_description: str
    avg_rating: float
    review_count: int
    average_price: float
    currency: str
    safety_index: int
    avg_temperature: Optional[float]
    activity_categories: List[str]
    image_url: Optional[str]
    is_featured: bool
    is_active: bool
    created_at: datetime

# Trip Models
class TripStatus(str, Enum):
    draft = "draft"
    planned = "planned"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class TripCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    traveler_count: int = 1
    total_budget: float
    currency: str = "USD"
    privacy_level: str = "private"
    destinations: List[Dict[str, Any]] = []

class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    traveler_count: Optional[int] = None
    total_budget: Optional[float] = None
    status: Optional[TripStatus] = None
    destinations: Optional[List[Dict[str, Any]]] = None

class Trip(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    start_date: date
    end_date: date
    traveler_count: int
    total_budget: float
    currency: str
    status: str
    privacy_level: str
    destinations: List[Dict[str, Any]]
    ai_suggestions: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

# Booking Models
class BookingType(str, Enum):
    flight = "flight"
    hotel = "hotel"
    activity = "activity"
    transport = "transport"

class BookingCreate(BaseModel):
    trip_id: Optional[str] = None
    booking_type: BookingType
    amount: float
    currency: str = "USD"
    booking_details: Dict[str, Any]
    service_date: date

class Booking(BaseModel):
    id: str
    user_id: str
    trip_id: Optional[str]
    booking_type: str
    status: str
    amount: float
    currency: str
    booking_details: Dict[str, Any]
    service_date: date
    created_at: datetime

# Review Models
class ReviewCreate(BaseModel):
    destination_id: str
    trip_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    content: str

class Review(BaseModel):
    id: str
    user_id: str
    destination_id: str
    trip_id: Optional[str]
    rating: int
    title: Optional[str]
    content: str
    is_approved: bool
    helpful_votes: int
    created_at: datetime

# AI Assistant Models
class AITravelRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    user_preferences: Optional[Dict[str, Any]] = None

class AITravelResponse(BaseModel):
    response: str
    suggestions: Optional[List[Dict[str, Any]]] = None
    destinations: Optional[List[str]] = None

# Maps Models
class LocationSearch(BaseModel):
    query: str
    location_bias: Optional[Dict[str, float]] = None  # lat, lng

class PlaceDetails(BaseModel):
    place_id: str

class DirectionsRequest(BaseModel):
    origin: str
    destination: str
    waypoints: Optional[List[str]] = None
    travel_mode: str = "driving"

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None