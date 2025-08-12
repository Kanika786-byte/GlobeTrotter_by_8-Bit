from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
import uuid

from app.database import database, bookings_table
from app.models import Booking, BookingCreate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[Booking])
async def get_user_bookings(
    current_user = Depends(get_current_active_user),
    booking_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
):
    """Get user's bookings"""
    query = bookings_table.select().where(bookings_table.c.user_id == current_user.id)
    
    if booking_type:
        query = query.where(bookings_table.c.booking_type == booking_type)
    
    if status:
        query = query.where(bookings_table.c.status == status)
    
    query = query.order_by(bookings_table.c.created_at.desc()).offset(skip).limit(limit)
    
    bookings = await database.fetch_all(query)
    return [Booking(**dict(booking)) for booking in bookings]

@router.post("/", response_model=Booking)
async def create_booking(
    booking: BookingCreate,
    current_user = Depends(get_current_active_user)
):
    """Create new booking"""
    booking_id = str(uuid.uuid4())
    booking_data = booking.dict()
    booking_data["id"] = booking_id
    booking_data["user_id"] = current_user.id
    
    query = bookings_table.insert().values(**booking_data)
    await database.execute(query)
    
    # Fetch the created booking
    created_booking = await database.fetch_one(
        bookings_table.select().where(bookings_table.c.id == booking_id)
    )
    
    return Booking(**dict(created_booking))

@router.get("/{booking_id}", response_model=Booking)
async def get_booking(
    booking_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get single booking"""
    query = bookings_table.select().where(
        bookings_table.c.id == booking_id,
        bookings_table.c.user_id == current_user.id
    )
    
    booking = await database.fetch_one(query)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return Booking(**dict(booking))

@router.put("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    current_user = Depends(get_current_active_user)
):
    """Cancel booking"""
    # Check if booking exists and belongs to user
    existing_booking = await database.fetch_one(
        bookings_table.select().where(
            bookings_table.c.id == booking_id,
            bookings_table.c.user_id == current_user.id
        )
    )
    
    if not existing_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if existing_booking["status"] in ["cancelled", "completed"]:
        raise HTTPException(status_code=400, detail="Booking cannot be cancelled")
    
    # Update booking status
    query = bookings_table.update().where(bookings_table.c.id == booking_id).values(
        status="cancelled"
    )
    await database.execute(query)
    
    return {"message": "Booking cancelled successfully"}