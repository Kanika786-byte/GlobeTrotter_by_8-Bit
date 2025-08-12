from fastapi import APIRouter, Depends, HTTPException
from app.database import database, users_table, trips_table, bookings_table, reviews_table
from app.models import User, UserUpdate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/profile", response_model=User)
async def get_user_profile(current_user = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.put("/profile", response_model=User)
async def update_user_profile(
    user_update: UserUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update user profile"""
    # Update only provided fields
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        query = users_table.update().where(users_table.c.id == current_user.id).values(**update_data)
        await database.execute(query)
    
    # Fetch updated user
    updated_user = await database.fetch_one(
        users_table.select().where(users_table.c.id == current_user.id)
    )
    
    return User(**dict(updated_user))

@router.get("/stats")
async def get_user_stats(current_user = Depends(get_current_active_user)):
    """Get user statistics"""
    # Get trip stats
    trip_stats = await database.fetch_one(
        f"""
        SELECT 
            COUNT(*) as total_trips,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_trips,
            SUM(total_budget) as total_budget
        FROM trips 
        WHERE user_id = '{current_user.id}'
        """
    )
    
    # Get booking stats
    booking_stats = await database.fetch_one(
        f"""
        SELECT 
            COUNT(*) as total_bookings,
            SUM(amount) as total_spent
        FROM bookings 
        WHERE user_id = '{current_user.id}' AND status = 'confirmed'
        """
    )
    
    # Get review stats
    review_stats = await database.fetch_one(
        f"""
        SELECT 
            COUNT(*) as total_reviews,
            AVG(rating) as avg_rating
        FROM reviews 
        WHERE user_id = '{current_user.id}'
        """
    )
    
    return {
        "total_trips": trip_stats["total_trips"] or 0,
        "completed_trips": trip_stats["completed_trips"] or 0,
        "total_budget": float(trip_stats["total_budget"] or 0),
        "total_bookings": booking_stats["total_bookings"] or 0,
        "total_spent": float(booking_stats["total_spent"] or 0),
        "total_reviews": review_stats["total_reviews"] or 0,
        "avg_review_rating": float(review_stats["avg_rating"] or 0),
        "member_since": current_user.created_at,
        "profile_completion": calculate_profile_completion(current_user)
    }

def calculate_profile_completion(user: User) -> int:
    """Calculate profile completion percentage"""
    fields = [
        user.first_name,
        user.last_name,
        user.profile_image_url,
        user.travel_preferences
    ]
    
    completed_fields = sum(1 for field in fields if field)
    return int((completed_fields / len(fields)) * 100)

@router.delete("/account")
async def delete_user_account(current_user = Depends(get_current_active_user)):
    """Delete user account (soft delete)"""
    # Soft delete - deactivate account
    query = users_table.update().where(users_table.c.id == current_user.id).values(
        is_active=False,
        email=f"deleted_{current_user.id}@deleted.com"
    )
    await database.execute(query)
    
    return {"message": "Account deleted successfully"}