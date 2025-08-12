import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Plane, Car, Train, Building, Bus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { DatePicker } from '../components/ui/DatePicker';
import { Destination } from '../types';
import toast from 'react-hot-toast';
import { StripePayment } from '../components/payment';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';

interface ServiceOption {
  id: string;
  type: 'flight' | 'hotel' | 'cab' | 'train' | 'bus';
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
    description: 'Book flights to your destination',
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
    description: 'Comfortable stay at your destination',
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
    description: 'Convenient cab services for local travel',
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
    description: 'Scenic train travel to your destination',
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
  },
  {
    id: 'bus-1',
    type: 'bus',
    name: 'Bus Travel',
    description: 'Affordable bus transportation',
    pricing: {
      costEffective: 600,
      luxury: 2200,
      customization: 1400
    },
    features: {
      costEffective: ['Standard Seat', 'AC Bus', 'Basic Amenities'],
      luxury: ['Luxury Sleeper', 'Premium AC', 'Entertainment System', 'Refreshments'],
      customization: ['Semi-Sleeper', 'Enhanced AC', 'USB Charging', 'Snacks']
    },
    rating: 3.8,
    reviews: 1800
  }
];

export const BookingPage: React.FC = () => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination as Destination || location.state?.destination;
  const preSelectedServices = location.state?.selectedServices || [];
  const preSelectedTiers = location.state?.selectedTiers || {};
  const preCalculatedTotal = location.state?.totalAmount || 0;
  const { selectedCurrency } = useCurrencyStore();

  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(preSelectedServices));
  const [selectedTiers, setSelectedTiers] = useState<Record<string, 'costEffective' | 'luxury' | 'customization'>>(preSelectedTiers);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    travelers: 1,
    specialRequests: ''
  });

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Destination not found</h3>
          <Button onClick={() => navigate('/plan-trip')}>Back to Plan Trip</Button>
        </div>
      </div>
    );
  }

  const getServiceIcon = (type: ServiceOption['type']) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building;
      case 'cab': return Car;
      case 'train': return Train;
      case 'bus': return Bus;
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

  const handleBooking = () => {
    if (selectedServices.size === 0) {
      toast.error('Please select at least one service');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false);
    
    // Show detailed success message
    toast.success(`🎉 Services booked successfully! Booking ID: ${paymentId.slice(-6).toUpperCase()}`);
    
    // Create booking entries for each selected service
    const newBookings = Array.from(selectedServices).map(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId);
      const tier = selectedTiers[serviceId];
      
      return {
        id: `${paymentId}_${serviceId}`,
        destination: destination.name,
        serviceType: service?.name || 'Service',
        tier: getTierLabel(tier || 'costEffective'),
        amount: service?.pricing[tier || 'costEffective'] || 0,
        status: 'confirmed',
        paymentId: paymentId,
        bookingDate: new Date().toISOString()
      };
    });
    
    // Store bookings in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    existingBookings.unshift(...newBookings);
    localStorage.setItem('user_bookings', JSON.stringify(existingBookings));
    
    // Navigate to bookings page
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Services for {destination.name}</h1>
            <p className="text-gray-600 mt-1">{destination.city}, {destination.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Available Services</h2>
            
            {serviceOptions.map((service) => {
              const Icon = getServiceIcon(service.type);
              const isSelected = selectedServices.has(service.id);
              const selectedTier = selectedTiers[service.id] || 'costEffective';

              return (
                <Card key={service.id} className={`transition-all ${isSelected ? 'ring-2 ring-orange-500' : ''}`}>
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
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
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
                              {formatPrice(service.pricing[tier], selectedCurrency)}
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
                </Card>
              );
            })}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{destination.name}</h4>
                    <p className="text-sm text-gray-600">{destination.city}, {destination.country}</p>
                  </div>
                </div>

                {selectedServices.size > 0 ? (
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Selected Services:</h5>
                    {Array.from(selectedServices).map((serviceId) => {
                      const service = serviceOptions.find(s => s.id === serviceId);
                      const tier = selectedTiers[serviceId];
                      if (!service || !tier) return null;

                      return (
                        <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-gray-600">{getTierLabel(tier)}</p>
                          </div>
                          <p className="font-semibold">₹{service.pricing[tier].toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No services selected</p>
                )}
              </div>

              {selectedServices.size > 0 && (
                <>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-orange-600">{formatPrice(calculateTotal(), selectedCurrency)}</span>
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full">
                    Proceed to Book
                  </Button>
                </>
              )}
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
              <DatePicker
                label="Check-in Date"
                value={bookingDetails.checkIn}
                onChange={(date) => setBookingDetails(prev => ({ ...prev, checkIn: date }))}
                required
              />
              <DatePicker
                label="Check-out Date"
                value={bookingDetails.checkOut}
                onChange={(date) => setBookingDetails(prev => ({ ...prev, checkOut: date }))}
                minDate={bookingDetails.checkIn}
                excludeSameDay={true}
                required
              />
            </div>

            <Input
              label="Number of Travelers"
              type="number"
              min="1"
              value={bookingDetails.travelers}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
            />

            <div>
              <Textarea
                label="Special Requests (Optional)"
                rows={3}
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
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
                  <span className="text-orange-600">{formatPrice(calculateTotal(), selectedCurrency)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowBookingModal(false);
                setShowPaymentModal(true);
              }}>
                Proceed to Payment
              </Button>
            </div>
          </div>
        </Modal>

        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Complete Payment"
          size="lg"
        >
          <StripePayment
            amount={calculateTotal()}
            description={`Booking services for ${destination.name}`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};