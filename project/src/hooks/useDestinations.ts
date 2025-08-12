import { useState, useEffect } from 'react';
import { getDestinations, getFeaturedDestinations } from '../lib/supabase';
import { Destination, SearchFilters } from '../types';

export const useDestinations = (filters?: SearchFilters) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock destinations for demo
  const mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'Goa',
      city: 'Panaji',
      country: 'India',
      continent: 'Asia',
      description: 'Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area\'s tropical spice plantations.',
      shortDescription: 'Beautiful beaches and Portuguese heritage',
      latitude: 15.2993,
      longitude: 74.1240,
      avgRating: 4.5,
      reviewCount: 2847,
      averagePrice: 3500,
      safetyIndex: 85,
      avgTemperature: 28,
      imageUrl: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Beach', 'Culture', 'Nightlife', 'Food', 'Adventure']
    },
    {
      id: '2',
      name: 'Dubai',
      city: 'Dubai',
      country: 'United Arab Emirates',
      continent: 'Asia',
      description: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.',
      shortDescription: 'Luxury shopping and modern architecture',
      latitude: 25.2048,
      longitude: 55.2708,
      avgRating: 4.7,
      reviewCount: 5234,
      averagePrice: 15000,
      safetyIndex: 95,
      avgTemperature: 32,
      imageUrl: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Urban', 'Shopping', 'Culture', 'Adventure', 'Luxury']
    },
    {
      id: '3',
      name: 'Bangkok',
      city: 'Bangkok',
      country: 'Thailand',
      continent: 'Asia',
      description: 'Bangkok, Thailand\'s capital, is a large city known for ornate shrines and vibrant street life.',
      shortDescription: 'Vibrant street life and ornate temples',
      latitude: 13.7563,
      longitude: 100.5018,
      avgRating: 4.6,
      reviewCount: 4156,
      averagePrice: 8000,
      safetyIndex: 78,
      avgTemperature: 30,
      imageUrl: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Culture', 'Food', 'Urban', 'Shopping', 'Nightlife']
    },
    {
      id: '4',
      name: 'Singapore',
      city: 'Singapore',
      country: 'Singapore',
      continent: 'Asia',
      description: 'Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population.',
      shortDescription: 'Modern city-state with multicultural charm',
      latitude: 1.3521,
      longitude: 103.8198,
      avgRating: 4.5,
      reviewCount: 3892,
      averagePrice: 18000,
      safetyIndex: 98,
      avgTemperature: 27,
      imageUrl: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Urban', 'Culture', 'Food', 'Shopping', 'Nature']
    }
  ];

  const fetchDestinations = async (searchFilters?: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get destinations from Supabase
      const data = await getDestinations(searchFilters);
      setDestinations(data.length > 0 ? data : mockDestinations);
    } catch (err) {
      // Fallback to mock data on error
      setDestinations(mockDestinations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations(filters);
  }, [filters?.query, filters?.country, filters?.continent, filters?.minRating, filters?.maxPrice]);

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations
  };
};

export const useFeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock featured destinations
  const mockFeaturedDestinations: Destination[] = [
    {
      id: '1',
      name: 'Goa',
      city: 'Panaji',
      country: 'India',
      continent: 'Asia',
      description: 'Beautiful beaches and Portuguese heritage',
      shortDescription: 'Beautiful beaches and Portuguese heritage',
      latitude: 15.2993,
      longitude: 74.1240,
      avgRating: 4.5,
      reviewCount: 2847,
      averagePrice: 3500,
      safetyIndex: 85,
      avgTemperature: 28,
      imageUrl: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Beach', 'Culture', 'Nightlife', 'Food', 'Adventure']
    },
    {
      id: '2',
      name: 'Dubai',
      city: 'Dubai',
      country: 'United Arab Emirates',
      continent: 'Asia',
      description: 'Luxury shopping and modern architecture',
      shortDescription: 'Luxury shopping and modern architecture',
      latitude: 25.2048,
      longitude: 55.2708,
      avgRating: 4.7,
      reviewCount: 5234,
      averagePrice: 15000,
      safetyIndex: 95,
      avgTemperature: 32,
      imageUrl: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      activityCategories: ['Urban', 'Shopping', 'Culture', 'Adventure', 'Luxury']
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Try to get featured destinations from Supabase
        const data = await getFeaturedDestinations();
        setDestinations(data.length > 0 ? data : mockFeaturedDestinations);
      } catch (err) {
        // Fallback to mock data on error
        setDestinations(mockFeaturedDestinations);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { destinations, loading, error };
};