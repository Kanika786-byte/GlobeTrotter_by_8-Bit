import asyncio
import uuid
from app.database import database, destinations_table

# Sample destinations data
destinations_data = [
    {
        "id": str(uuid.uuid4()),
        "name": "Goa",
        "city": "Panaji",
        "country": "India",
        "continent": "Asia",
        "latitude": 15.2993,
        "longitude": 74.1240,
        "description": "Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area's tropical spice plantations.",
        "short_description": "Beautiful beaches and Portuguese heritage",
        "avg_rating": 4.5,
        "review_count": 2847,
        "average_price": 3500,
        "currency": "INR",
        "safety_index": 85,
        "avg_temperature": 28.0,
        "activity_categories": ["Beach", "Culture", "Nightlife", "Food", "Adventure"],
        "image_url": "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800",
        "is_featured": True,
        "is_active": True
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Dubai",
        "city": "Dubai",
        "country": "United Arab Emirates",
        "continent": "Asia",
        "latitude": 25.2048,
        "longitude": 55.2708,
        "description": "Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.",
        "short_description": "Luxury shopping and modern architecture",
        "avg_rating": 4.7,
        "review_count": 5234,
        "average_price": 15000,
        "currency": "AED",
        "safety_index": 95,
        "avg_temperature": 32.0,
        "activity_categories": ["Urban", "Shopping", "Culture", "Adventure", "Luxury"],
        "image_url": "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800",
        "is_featured": True,
        "is_active": True
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bangkok",
        "city": "Bangkok",
        "country": "Thailand",
        "continent": "Asia",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "description": "Bangkok, Thailand's capital, is a large city known for ornate shrines and vibrant street life.",
        "short_description": "Vibrant street life and ornate temples",
        "avg_rating": 4.6,
        "review_count": 4156,
        "average_price": 8000,
        "currency": "THB",
        "safety_index": 78,
        "avg_temperature": 30.0,
        "activity_categories": ["Culture", "Food", "Urban", "Shopping", "Nightlife"],
        "image_url": "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800",
        "is_featured": True,
        "is_active": True
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Singapore",
        "city": "Singapore",
        "country": "Singapore",
        "continent": "Asia",
        "latitude": 1.3521,
        "longitude": 103.8198,
        "description": "Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population.",
        "short_description": "Modern city-state with multicultural charm",
        "avg_rating": 4.5,
        "review_count": 3892,
        "average_price": 18000,
        "currency": "SGD",
        "safety_index": 98,
        "avg_temperature": 27.0,
        "activity_categories": ["Urban", "Culture", "Food", "Shopping", "Nature"],
        "image_url": "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800",
        "is_featured": True,
        "is_active": True
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bali",
        "city": "Denpasar",
        "country": "Indonesia",
        "continent": "Asia",
        "latitude": -8.3405,
        "longitude": 115.0920,
        "description": "Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands, known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
        "short_description": "Tropical paradise with rich culture",
        "avg_rating": 4.6,
        "review_count": 6789,
        "average_price": 6500,
        "currency": "IDR",
        "safety_index": 85,
        "avg_temperature": 28.0,
        "activity_categories": ["Beach", "Culture", "Nature", "Adventure", "Relaxation"],
        "image_url": "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
        "is_featured": True,
        "is_active": True
    }
]

async def seed_destinations():
    """Seed the database with sample destinations"""
    await database.connect()
    
    try:
        # Clear existing data
        await database.execute(destinations_table.delete())
        
        # Insert sample data
        for destination in destinations_data:
            query = destinations_table.insert().values(**destination)
            await database.execute(query)
        
        print(f"Successfully seeded {len(destinations_data)} destinations!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
    
    finally:
        await database.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_destinations())