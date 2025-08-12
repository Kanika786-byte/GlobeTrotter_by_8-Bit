from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
import uuid

from app.database import database, destinations_table
from app.models import Destination, DestinationCreate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[Destination])
async def get_destinations(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    country: Optional[str] = None,
    continent: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_price: Optional[float] = None,
    categories: Optional[str] = Query(None, description="Comma-separated activity categories")
):
    """Get destinations with filtering"""
    query = destinations_table.select().where(destinations_table.c.is_active == True)
    
    if search:
        query = query.where(
            destinations_table.c.name.ilike(f"%{search}%") |
            destinations_table.c.city.ilike(f"%{search}%") |
            destinations_table.c.country.ilike(f"%{search}%")
        )
    
    if country:
        query = query.where(destinations_table.c.country.ilike(f"%{country}%"))
    
    if continent:
        query = query.where(destinations_table.c.continent == continent)
    
    if min_rating:
        query = query.where(destinations_table.c.avg_rating >= min_rating)
    
    if max_price:
        query = query.where(destinations_table.c.average_price <= max_price)
    
    # Add category filtering logic here if needed
    
    query = query.order_by(destinations_table.c.avg_rating.desc()).offset(skip).limit(limit)
    
    destinations = await database.fetch_all(query)
    return [Destination(**dict(dest)) for dest in destinations]

@router.get("/featured", response_model=List[Destination])
async def get_featured_destinations():
    """Get featured destinations"""
    query = destinations_table.select().where(
        destinations_table.c.is_featured == True,
        destinations_table.c.is_active == True
    ).order_by(destinations_table.c.avg_rating.desc()).limit(8)
    
    destinations = await database.fetch_all(query)
    return [Destination(**dict(dest)) for dest in destinations]

@router.get("/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    """Get single destination"""
    query = destinations_table.select().where(
        destinations_table.c.id == destination_id,
        destinations_table.c.is_active == True
    )
    
    destination = await database.fetch_one(query)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    return Destination(**dict(destination))

@router.post("/", response_model=Destination)
async def create_destination(
    destination: DestinationCreate,
    current_user = Depends(get_current_active_user)
):
    """Create new destination (admin only)"""
    destination_id = str(uuid.uuid4())
    destination_data = destination.dict()
    destination_data["id"] = destination_id
    
    # Add default image if not provided
    if not destination_data.get("image_url"):
        destination_data["image_url"] = f"https://images.pexels.com/photos/{hash(destination.name) % 1000000}/pexels-photo-{hash(destination.name) % 1000000}.jpeg?auto=compress&cs=tinysrgb&w=800"
    
    query = destinations_table.insert().values(**destination_data)
    await database.execute(query)
    
    return Destination(**destination_data)

@router.get("/search/nearby")
async def search_nearby_destinations(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(50, description="Search radius in kilometers"),
    limit: int = Query(20, description="Maximum number of results")
):
    """Search destinations near coordinates"""
    # Simple distance calculation (for production, use PostGIS or similar)
    query = f"""
    SELECT *, 
           (6371 * acos(cos(radians({lat})) * cos(radians(latitude)) * 
           cos(radians(longitude) - radians({lng})) + sin(radians({lat})) * 
           sin(radians(latitude)))) AS distance
    FROM destinations 
    WHERE is_active = true
    HAVING distance <= {radius}
    ORDER BY distance
    LIMIT {limit}
    """
    
    destinations = await database.fetch_all(query)
    return [dict(dest) for dest in destinations]