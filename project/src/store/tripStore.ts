import { create } from 'zustand';
import { Trip, TripStop } from '../types';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (tripId: string) => void;
  addTripStop: (tripId: string, stop: TripStop) => void;
  removeTripStop: (tripId: string, stopId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  updateTrip: (updatedTrip) => set((state) => ({
    trips: state.trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip),
    currentTrip: state.currentTrip?.id === updatedTrip.id ? updatedTrip : state.currentTrip
  })),
  deleteTrip: (tripId) => set((state) => ({
    trips: state.trips.filter(trip => trip.id !== tripId),
    currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip
  })),
  addTripStop: (tripId, stop) => set((state) => ({
    trips: state.trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, stops: [...trip.stops, stop] }
        : trip
    ),
    currentTrip: state.currentTrip?.id === tripId 
      ? { ...state.currentTrip, stops: [...state.currentTrip.stops, stop] }
      : state.currentTrip
  })),
  removeTripStop: (tripId, stopId) => set((state) => ({
    trips: state.trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, stops: trip.stops.filter(stop => stop.id !== stopId) }
        : trip
    ),
    currentTrip: state.currentTrip?.id === tripId 
      ? { ...state.currentTrip, stops: state.currentTrip.stops.filter(stop => stop.id !== stopId) }
      : state.currentTrip
  })),
  setLoading: (loading) => set({ loading }),
}));