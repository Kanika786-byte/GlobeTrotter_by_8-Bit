import { useState, useEffect } from 'react';
import { tripsAPI } from '../services/api';
import { Trip } from '../types';
import { useAuthStore } from '../store/authStore';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Mock trips for demo
  const mockTrips: Trip[] = [
    {
      id: '1',
      userId: 'demo-user',
      title: 'European Adventure',
      description: 'A wonderful journey through Europe visiting Paris, Rome, and Barcelona',
      startDate: '2025-06-15',
      endDate: '2025-06-25',
      travelerCount: 2,
      status: 'planned',
      totalBudget: 5000,
      currency: 'USD',
      privacyLevel: 'private',
      stops: [],
      createdAt: '2025-01-10T10:00:00Z'
    },
    {
      id: '2',
      userId: 'demo-user',
      title: 'Goa Beach Vacation',
      description: 'Relaxing beach vacation in beautiful Goa',
      startDate: '2025-03-20',
      endDate: '2025-03-27',
      travelerCount: 4,
      status: 'draft',
      totalBudget: 2500,
      currency: 'USD',
      privacyLevel: 'friends',
      stops: [],
      createdAt: '2025-01-08T15:30:00Z'
    }
  ];

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get trips from Supabase
      if (user?.id) {
        const data = await tripsAPI.getUserTrips(user.id);
        setTrips(data.length > 0 ? data : mockTrips);
      } else {
        setTrips(mockTrips);
      }
    } catch (err) {
      // Fallback to mock data on error
      setTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt' | 'stops'>) => {
    try {
      const newTrip = await tripsAPI.createTrip(tripData);
      
      setTrips(prev => [newTrip, ...prev]);
      return newTrip;
    } catch (err) {
      throw err;
    }
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      // For now, just update locally (implement Supabase update later)
      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, ...updates } : trip
      ));
      await fetchTrips(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      // For now, just delete locally (implement Supabase delete later)
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      await fetchTrips(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  return {
    trips,
    loading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips
  };
};