import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UsersIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Plane, Car, Train, Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Destination } from '../types';
import toast from 'react-hot-toast';
import { SeasonalWeather } from '../components/destinations/SeasonalWeather';
import { useTrips } from '../hooks/useTrips';

// Mock destination data - replace with actual API call
const mockDestination: Destination = {
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
  imageUrl: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1200',
  featured: true,
  activityCategories: ['Beach', 'Culture', 'Nightlife', 'Food', 'Adventure']
};

interface ServiceOption {
  id: string;
  type: 'flight' | 'hotel' | 'cab' | 'train';
  name: string;
  description: string;
  pricing: {
    costEffective: number;
    luxury: number;
    customization: number;
  };
  features: {
    costEffective: string[];
    luxury: string[];
    customization: string[];
  };
  rating: number;
  reviews: number;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'flight-1',
    type: 'flight',
    name: 'Flight Booking',
    description: 'Book flights to Goa',
    pricing: {
      costEffective: 8500,
      luxury: 25000,
      customization: 18000
    },
    features: {
      costEffective: ['Economy Class', 'Basic Meal', '20kg Baggage', 'Standard Seat'],
      luxury: ['Business Class', 'Premium Meal', '40kg Baggage', 'Priority Boarding', 'Lounge Access'],
      customization: ['Premium Economy', 'Meal Choice', '30kg Baggage', 'Seat Selection', 'Fast Track']
    },
    rating: 4.2,
    reviews: 1250
  },
  {
    id: 'hotel-1',
    type: 'hotel',
    name: 'Hotel Accommodation',
    description: 'Comfortable stay in Goa',
    pricing: {
      costEffective: 2500,
      luxury: 12000,
      customization: 6500
    },
    features: {
      costEffective: ['Standard Room', 'Basic Amenities', 'WiFi', 'Daily Housekeeping'],
      luxury: ['Suite', 'Premium Amenities', 'Spa Access', 'Concierge Service', 'Fine Dining', 'Pool'],
      customization: ['Deluxe Room', 'Enhanced Amenities', 'Room Service', 'Gym Access', 'Restaurant']
    },
    rating: 4.5,
    reviews: 890
  },
  {
    id: 'cab-1',
    type: 'cab',
    name: 'Local Transportation',
    description: 'Convenient cab services in Goa',
    pricing: {
      costEffective: 800,
      luxury: 3500,
      customization: 1800
    },
    features: {
      costEffective: ['Shared Cab', 'AC Vehicle', 'Basic Insurance'],
      luxury: ['Private Luxury Car', 'Professional Driver', 'Premium Insurance', 'Refreshments'],
      customization: ['Private Sedan', 'Experienced Driver', 'Comprehensive Insurance', 'Flexible Timing']
    },
    rating: 4.1,
    reviews: 2100
  },
  {
    id: 'train-1',
    type: 'train',
    name: 'Train Journey',
    description: 'Scenic train travel to Goa',
    pricing: {
      costEffective: 1200,
      luxury: 4500,
      customization: 2800
    },
    features: {
      costEffective: ['Sleeper Class', 'Basic Bedding', 'Meals Available'],
      luxury: ['First AC', 'Premium Bedding', 'Gourmet Meals', 'Personal Attendant'],
      customization: ['Second AC', 'Comfortable Bedding', 'Quality Meals', 'Priority Booking']
    },
    rating: 4.0,
    reviews: 750
  }
];

export const DestinationDetailPage: React.FC = () => {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedTiers, setSelectedTiers] = useState<Record<string, 'costEffective' | 'luxury' | 'customization'>>({});
  const [saved, setSaved] = useState(false);

  const handleAddToTrip = async () => {
    try {
      const tripData = {
        title: `Trip to ${destination?.name}`,
        description: `Exploring ${destination?.name}, ${destination?.country}`,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelerCount: 1,
        totalBudget: destination?.averagePrice ? destination.averagePrice * 7 : 25000,
        currency: 'USD',
        privacyLevel: 'private' as const
      };

      await createTrip(tripData);
      toast.success(`${destination?.name} added to your trips!`);
      navigate('/trips');
    } catch (error) {
      toast.error('Failed to add destination to trip');
    }
  };

  const handleViewOnMap = () => {
    if (destination) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
      window.open(mapUrl, '_blank');
    }
  };

  const handleSaveDestination = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved destinations' : 'Destination saved!');
  };

  const handleShareDestination = () => {
    if (destination) {
      navigator.clipboard.writeText(`Check out ${destination.name} - ${window.location.href}`);
      toast.success('Destination link copied to clipboard!');
    }
  };
  useEffect(() => {
    // In a real app, fetch destination by ID
    setDestination(mockDestination);
  }, [destinationId]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const getServiceIcon = (type: ServiceOption['type']) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building;
      case 'cab': return Car;
      case 'train': return Train;
      default: return Plane;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'costEffective': return 'bg-green-100 text-green-800 border-green-200';
      case 'luxury': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'customization': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'costEffective': return 'Cost Effective';
      case 'luxury': return 'Luxury';
      case 'customization': return 'Customization';
      default: return tier;
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
      const newTiers = { ...selectedTiers };
      delete newTiers[serviceId];
      setSelectedTiers(newTiers);
    } else {
      newSelected.add(serviceId);
      setSelectedTiers(prev => ({ ...prev, [serviceId]: 'costEffective' }));
    }
    setSelectedServices(newSelected);
  };

  const handleTierChange = (serviceId: string, tier: 'costEffective' | 'luxury' | 'customization') => {
    setSelectedTiers(prev => ({ ...prev, [serviceId]: tier }));
  };

  const calculateTotal = () => {
    return Array.from(selectedServices).reduce((total, serviceId) => {
      const service = serviceOptions.find(s => s.id === serviceId);
      const tier = selectedTiers[serviceId];
      if (service && tier) {
        return total + service.pricing[tier];
      }
      return total;
    }, 0);
  };

  const handleBookServices = () => {
    if (selectedServices.size === 0) {
      toast.error('Please select at least one service');
      return;
    }
    
    // Navigate to booking page with selected services
    navigate('/book/services', {
      state: {
        destination,
        selectedServices: Array.from(selectedServices),
        selectedTiers,
        totalAmount: calculateTotal()
      }
    });
  };

  const confirmBooking = () => {
    toast.success('Services booked successfully!');
    setShowBookingModal(false);
    navigate('/bookings');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      return (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${destination.imageUrl})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">{destination.city}, {destination.country}</span>
              </div>
              <div className="flex items-center">
                {renderStars(destination.avgRating)}
                <span className="ml-2 text-lg">{destination.avgRating} ({destination.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                <span className="text-lg">₹{destination.averagePrice}/day</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDestination}
                  className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                >
                  <HeartIcon className={`h-4 w-4 mr-2 ${saved ? 'fill-current text-red-400' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareDestination}
                  className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About {destination.name}</h2>
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {destination.activityCategories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </Card>

            {/* Seasonal Weather */}
            <SeasonalWeather 
              seasonalTemperatures={destination.seasonalTemperatures}
              destinationName={destination.name}
            />

            {/* Services Section */}
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book Services for Your Trip</h2>
              <p className="text-gray-600 mb-6">Select the services you need for your trip to {destination.name}:</p>
              
              <div className="space-y-6">
                {serviceOptions.map((service) => {
                  const Icon = getServiceIcon(service.type);
                  const isSelected = selectedServices.has(service.id);
                  const selectedTier = selectedTiers[service.id] || 'costEffective';

                  return (
                    <div key={service.id} className={`border-2 rounded-lg p-4 transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Icon className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {renderStars(service.rating)}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {service.rating} ({service.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleServiceToggle(service.id)}
                            className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                          />
                        </label>
                      </div>

                      {isSelected && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Choose Your Package:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(['costEffective', 'luxury', 'customization'] as const).map((tier) => (
                              <div
                                key={tier}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedTier === tier
                                    ? getTierColor(tier) + ' border-current'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleTierChange(service.id, tier)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold">{getTierLabel(tier)}</h5>
                                  <input
                                    type="radio"
                                    name={`tier-${service.id}`}
                                    checked={selectedTier === tier}
                                    onChange={() => handleTierChange(service.id, tier)}
                                    className="h-4 w-4 text-orange-600"
                                  />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                  ₹{service.pricing[tier].toLocaleString()}
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {service.features[tier].map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedServices.size > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <Button onClick={handleBookServices} className="w-full">
                    Book Selected Services
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Temperature:</span>
                  <span className="font-medium">
                    {destination.avgTemperature ? `${Math.round(destination.avgTemperature)}°C` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Index:</span>
                  <span className="font-medium">{destination.safetyIndex}/100</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Daily Cost:</span>
                  <span className="font-medium">₹{destination.averagePrice}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-medium">{destination.reviewCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full mb-3" onClick={handleAddToTrip}>
                  Add to Trip
                </Button>
                <Button variant="outline" className="w-full" onClick={handleViewOnMap}>
                  View on Map
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Booking Modal */}
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Complete Your Booking"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Check-in Date"
                type="date"
              />
              <Input
                label="Check-out Date"
                type="date"
              />
            </div>

            <Input
              label="Number of Travelers"
              type="number"
              min="1"
              defaultValue="1"
            />

            <div>
              <Textarea
                label="Special Requests (Optional)"
                rows={3}
                placeholder="Any special requirements or requests..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span>{destination.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services:</span>
                  <span>{selectedServices.size} selected</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};