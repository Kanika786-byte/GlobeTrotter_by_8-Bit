import { Destination, Trip, Booking, Review, User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
const AI_API_BASE_URL = 'http://localhost:8000/api';
const MAPS_API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  async register(email: string, password: string, firstName: string, lastName: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName 
      })
    });
    return handleResponse(response);
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async signOut() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async checkAuthStatus() {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getGoogleAuthUrl() {
    return `${API_BASE_URL}/auth/google`;
  }
};

// User API
export const userAPI = {
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async updateUser(updates: Partial<User>) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Destinations API
export const destinationsAPI = {
  async getDestinations(filters?: {
    query?: string;
    country?: string;
    continent?: string;
    minRating?: number;
    maxPrice?: number;
    categories?: string[];
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.query) params.append('search', filters.query);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.continent) params.append('continent', filters.continent);
    if (filters?.minRating) params.append('min_rating', filters.minRating.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.categories) params.append('categories', filters.categories.join(','));
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('skip', filters.offset.toString());

    const response = await fetch(`${API_BASE_URL}/destinations/?${params}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getDestinationById(id: string) {
    const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getFeaturedDestinations() {
    const response = await fetch(`${API_BASE_URL}/destinations/featured`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Trips API
export const tripsAPI = {
  async getUserTrips(userId: string) {
    const response = await fetch(`${API_BASE_URL}/trips/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async createTrip(tripData: any) {
    const response = await fetch(`${API_BASE_URL}/trips/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tripData)
    });
    return handleResponse(response);
  },

  async updateTrip(tripId: string, updates: Partial<Trip>) {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  async deleteTrip(tripId: string) {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async addDestinationToTrip(tripId: string, destinationData: any) {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/destinations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(destinationData)
    });
    return handleResponse(response);
  }
};

// Bookings API
export const bookingsAPI = {
  async getUserBookings(userId: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async createBooking(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(response);
  },

  async updateBooking(bookingId: string, updates: Partial<Booking>) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  async cancelBooking(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Reviews API
export const reviewsAPI = {
  async getDestinationReviews(destinationId: string, limit = 20, offset = 0) {
    const response = await fetch(`${API_BASE_URL}/reviews/destination/${destinationId}?limit=${limit}&skip=${offset}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async createReview(reviewData: any) {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(response);
  },

  async getUserReviews(userId: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/user`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// AI Assistant API
export const aiAPI = {
  async chatWithAssistant(message: string, context?: any) {
    const response = await fetch(`${AI_API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, context })
    });
    return handleResponse(response);
  },

  async suggestItinerary(destination: string, days: number, budget: number, interests: string[] = []) {
    const response = await fetch(`${AI_API_BASE_URL}/ai/suggest-itinerary`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ destination, days, budget, interests })
    });
    return handleResponse(response);
  }
};

// Maps API
export const mapsAPI = {
  async searchPlaces(query: string, location?: { lat: number; lng: number }) {
    const response = await fetch(`${MAPS_API_BASE_URL}/maps/search-places`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, location_bias: location })
    });
    return handleResponse(response);
  },

  async getPlaceDetails(placeId: string) {
    const response = await fetch(`${MAPS_API_BASE_URL}/maps/place-details/${placeId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getDirections(origin: string, destination: string, waypoints?: string[]) {
    const response = await fetch(`${MAPS_API_BASE_URL}/maps/directions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ origin, destination, waypoints })
    });
    return handleResponse(response);
  }
};