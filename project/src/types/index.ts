export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  description: string;
  shortDescription: string;
  latitude: number;
  longitude: number;
  avgRating: number;
  reviewCount: number;
  averagePrice: number;
  safetyIndex: number;
  avgTemperature: number;
  imageUrl: string;
  featured: boolean;
  activityCategories: string[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  status: 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';
  totalBudget: number;
  currency: string;
  privacyLevel: 'private' | 'friends' | 'public';
  stops: TripStop[];
  createdAt: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  destinationId: string;
  destination: Destination;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  notes: string;
  budget: number;
}

export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  tripId?: string;
  rating: number;
  title: string;
  content: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  sentimentScore: number;
  helpfulVotes: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  tripId?: string;
  bookingType: 'flight' | 'hotel' | 'activity' | 'transport' | 'package';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingDetails: Record<string, any>;
  bookingDate: string;
  serviceDate: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  destination: Destination;
  recommendationType: string;
  confidenceScore: number;
  explanation: string;
  features: Record<string, any>;
}

export interface SearchFilters {
  query?: string;
  country?: string;
  continent?: string;
  minRating?: number;
  maxPrice?: number;
  categories?: string[];
  sortBy?: 'rating' | 'price' | 'popularity' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  messageType: 'text' | 'location' | 'image';
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ItineraryActivity {
  name: string;
  location: string;
  image: string;
  duration: string;
  cost: number;
  description: string;
  distance: string;
  timeSlot: string;
  category: string;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: string;
  title: string;
  content: string;
  read: boolean;
  deliveredAt?: string;
  createdAt: string;
}