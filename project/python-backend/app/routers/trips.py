from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
import uuid

from app.database import database, trips_table
from app.models import Trip, TripCreate, TripUpdate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[Trip])
async def get_user_trips(
    current_user = Depends(get_current_active_user),
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
):
    """Get user's trips"""
    query = trips_table.select().where(trips_table.c.user_id == current_user.id)
    
    if status:
        query = query.where(trips_table.c.status == status)
    
    query = query.order_by(trips_table.c.created_at.desc()).offset(skip).limit(limit)
    
    trips = await database.fetch_all(query)
    return [Trip(**dict(trip)) for trip in trips]

@router.post("/", response_model=Trip)
async def create_trip(
    trip: TripCreate,
    current_user = Depends(get_current_active_user)
):
    """Create new trip"""
    trip_id = str(uuid.uuid4())
    trip_data = trip.dict()
    trip_data["id"] = trip_id
    trip_data["user_id"] = current_user.id
    
    # Validate dates
    if trip_data["end_date"] <= trip_data["start_date"]:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    query = trips_table.insert().values(**trip_data)
    await database.execute(query)
    
    # Fetch the created trip
    created_trip = await database.fetch_one(
        trips_table.select().where(trips_table.c.id == trip_id)
    )
    
    return Trip(**dict(created_trip))

@router.get("/{trip_id}", response_model=Trip)
async def get_trip(
    trip_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get single trip"""
    query = trips_table.select().where(
        trips_table.c.id == trip_id,
        trips_table.c.user_id == current_user.id
    )
    
    trip = await database.fetch_one(query)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return Trip(**dict(trip))

@router.put("/{trip_id}", response_model=Trip)
async def update_trip(
    trip_id: str,
    trip_update: TripUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update trip"""
    # Check if trip exists and belongs to user
    existing_trip = await database.fetch_one(
        trips_table.select().where(
            trips_table.c.id == trip_id,
            trips_table.c.user_id == current_user.id
        )
    )
    
    if not existing_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in trip_update.dict().items() if v is not None}
    
    if update_data:
        query = trips_table.update().where(trips_table.c.id == trip_id).values(**update_data)
        await database.execute(query)
    
    # Fetch updated trip
    updated_trip = await database.fetch_one(
        trips_table.select().where(trips_table.c.id == trip_id)
    )
    
    return Trip(**dict(updated_trip))

@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete trip"""
    # Check if trip exists and belongs to user
    existing_trip = await database.fetch_one(
        trips_table.select().where(
            trips_table.c.id == trip_id,
            trips_table.c.user_id == current_user.id
        )
    )
    
    if not existing_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    query = trips_table.delete().where(trips_table.c.id == trip_id)
    await database.execute(query)
    
    return {"message": "Trip deleted successfully"}

@router.post("/{trip_id}/destinations")
async def add_destination_to_trip(
    trip_id: str,
    destination_data: dict,
    current_user = Depends(get_current_active_user)
):
    """Add destination to trip"""
    # Check if trip exists and belongs to user
    existing_trip = await database.fetch_one(
        trips_table.select().where(
            trips_table.c.id == trip_id,
            trips_table.c.user_id == current_user.id
        )
    )
    
    if not existing_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Get current destinations
    current_destinations = existing_trip["destinations"] or []
    current_destinations.append(destination_data)
    
    # Update trip
    query = trips_table.update().where(trips_table.c.id == trip_id).values(
        destinations=current_destinations
    )
    await database.execute(query)
    
    return {"message": "Destination added to trip successfully"}