from fastapi import APIRouter, Depends, HTTPException
from googlemaps import Client as GoogleMapsClient
from decouple import config
from typing import List, Optional

from app.models import LocationSearch, PlaceDetails, DirectionsRequest
from app.auth import get_current_active_user

router = APIRouter()

# Initialize Google Maps client
gmaps = GoogleMapsClient(key=config("GOOGLE_MAPS_API_KEY"))

@router.post("/search-places")
async def search_places(
    search: LocationSearch,
    current_user = Depends(get_current_active_user)
):
    """Search for places using Google Places API"""
    try:
        # Perform place search
        places_result = gmaps.places(
            query=search.query,
            location=search.location_bias,
            radius=50000  # 50km radius
        )
        
        # Format results
        formatted_results = []
        for place in places_result.get('results', []):
            formatted_results.append({
                'place_id': place['place_id'],
                'name': place['name'],
                'address': place.get('formatted_address', ''),
                'rating': place.get('rating'),
                'price_level': place.get('price_level'),
                'types': place.get('types', []),
                'location': place['geometry']['location'],
                'photos': [photo['photo_reference'] for photo in place.get('photos', [])[:3]]
            })
        
        return {
            'results': formatted_results,
            'status': places_result['status']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")

@router.get("/place-details/{place_id}")
async def get_place_details(
    place_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get detailed information about a specific place"""
    try:
        # Get place details
        place_details = gmaps.place(
            place_id=place_id,
            fields=[
                'name', 'formatted_address', 'international_phone_number',
                'website', 'rating', 'reviews', 'opening_hours', 'price_level',
                'photos', 'geometry', 'types', 'url'
            ]
        )
        
        result = place_details['result']
        
        # Format the response
        formatted_result = {
            'place_id': place_id,
            'name': result.get('name'),
            'address': result.get('formatted_address'),
            'phone': result.get('international_phone_number'),
            'website': result.get('website'),
            'rating': result.get('rating'),
            'price_level': result.get('price_level'),
            'types': result.get('types', []),
            'location': result['geometry']['location'],
            'opening_hours': result.get('opening_hours', {}).get('weekday_text', []),
            'reviews': [
                {
                    'author': review['author_name'],
                    'rating': review['rating'],
                    'text': review['text'],
                    'time': review['time']
                }
                for review in result.get('reviews', [])[:5]
            ],
            'photos': [photo['photo_reference'] for photo in result.get('photos', [])[:5]],
            'google_url': result.get('url')
        }
        
        return formatted_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")

@router.post("/directions")
async def get_directions(
    directions: DirectionsRequest,
    current_user = Depends(get_current_active_user)
):
    """Get directions between locations"""
    try:
        # Get directions
        directions_result = gmaps.directions(
            origin=directions.origin,
            destination=directions.destination,
            waypoints=directions.waypoints,
            mode=directions.travel_mode,
            alternatives=True
        )
        
        if not directions_result:
            raise HTTPException(status_code=404, detail="No routes found")
        
        # Format results
        formatted_routes = []
        for route in directions_result:
            legs = []
            for leg in route['legs']:
                legs.append({
                    'start_address': leg['start_address'],
                    'end_address': leg['end_address'],
                    'distance': leg['distance']['text'],
                    'duration': leg['duration']['text'],
                    'steps': [
                        {
                            'instruction': step['html_instructions'],
                            'distance': step['distance']['text'],
                            'duration': step['duration']['text'],
                            'travel_mode': step['travel_mode']
                        }
                        for step in leg['steps']
                    ]
                })
            
            formatted_routes.append({
                'summary': route['summary'],
                'legs': legs,
                'overview_polyline': route['overview_polyline']['points'],
                'total_distance': sum([leg['distance']['value'] for leg in route['legs']]),
                'total_duration': sum([leg['duration']['value'] for leg in route['legs']]),
                'warnings': route.get('warnings', [])
            })
        
        return {
            'routes': formatted_routes,
            'status': 'OK'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")

@router.get("/photo/{photo_reference}")
async def get_place_photo(
    photo_reference: str,
    max_width: int = 400,
    current_user = Depends(get_current_active_user)
):
    """Get place photo URL"""
    try:
        # Generate photo URL
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={config('GOOGLE_MAPS_API_KEY')}"
        
        return {
            'photo_url': photo_url,
            'photo_reference': photo_reference,
            'max_width': max_width
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")

@router.post("/geocode")
async def geocode_address(
    address: str,
    current_user = Depends(get_current_active_user)
):
    """Convert address to coordinates"""
    try:
        geocode_result = gmaps.geocode(address)
        
        if not geocode_result:
            raise HTTPException(status_code=404, detail="Address not found")
        
        result = geocode_result[0]
        
        return {
            'address': result['formatted_address'],
            'location': result['geometry']['location'],
            'place_id': result['place_id'],
            'types': result['types']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")

@router.post("/reverse-geocode")
async def reverse_geocode(
    lat: float,
    lng: float,
    current_user = Depends(get_current_active_user)
):
    """Convert coordinates to address"""
    try:
        reverse_geocode_result = gmaps.reverse_geocode((lat, lng))
        
        if not reverse_geocode_result:
            raise HTTPException(status_code=404, detail="Location not found")
        
        result = reverse_geocode_result[0]
        
        return {
            'address': result['formatted_address'],
            'location': {'lat': lat, 'lng': lng},
            'place_id': result['place_id'],
            'types': result['types']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maps API error: {str(e)}")