import React, { useState } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Car } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DatePicker } from '../components/ui/DatePicker';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const CabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    tripType: 'outstation'
  });
  const [selectedBudget, setSelectedBudget] = useState<'cost-effective' | 'luxury' | 'customization'>('cost-effective');
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, you would reverse geocode these coordinates
          // For demo, we'll use a mock location
          const mockLocation = 'Current Location (Detected)';
          setCurrentLocation(mockLocation);
          setSearchData(prev => ({ ...prev, from: mockLocation }));
          setLocationPermission('granted');
          toast.success('Location detected successfully!');
        } catch (error) {
          toast.error('Failed to get location details');
        }
      },
      (error) => {
        setLocationPermission('denied');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const budgetOptions = {
    'cost-effective': {
      title: 'Cost Effective',
      price: 800,
      description: 'Affordable cab service',
      features: [
        'Shared Cab',
        'AC Vehicle',
        'Basic Insurance',
        'Standard Driver',
        'GPS Tracking'
      ],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    'luxury': {
      title: 'Luxury',
      price: 3500,
      description: 'Premium cab experience',
      features: [
        'Private Luxury Car',
        'Professional Driver',
        'Premium Insurance',
        'Refreshments',
        'Wi-Fi',
        'Premium Support'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    'customization': {
      title: 'Customization',
      price: 1800,
      description: 'Tailored cab service',
      features: [
        'Private Sedan',
        'Experienced Driver',
        'Comprehensive Insurance',
        'Flexible Timing',
        'Route Customization',
        'Multiple Stops'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const handleSearch = () => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowBudgetOptions(true);
  };

  const handleBooking = () => {
    toast.success(`Cab booked successfully! ${budgetOptions[selectedBudget].title} package for ₹${budgetOptions[selectedBudget].price.toLocaleString()}`);
    navigate('/bookings');
  };

  const handleRouteSelect = (route: any) => {
    setSearchData(prev => ({
      ...prev,
      from: route.from,
      to: route.to
    }));
    setShowBudgetOptions(true);
  };

  const handleRecommendationSelect = (service: any) => {
    setSearchData(prev => ({
      ...prev,
      from: 'Current Location',
      to: service.service.split(' ')[0]
    }));
    setShowBudgetOptions(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Book Cabs</h1>
          </div>
          <p className="text-gray-600">Comfortable and reliable cab services</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="flex space-x-4 mb-4">
              {['outstation', 'local', 'airport'].map((type) => (
                <label key={type} className="flex items-center">
                  <input 
                    type="radio" 
                    name="tripType" 
                    value={type}
                    checked={searchData.tripType === type}
                    onChange={(e) => setSearchData(prev => ({ ...prev, tripType: e.target.value }))}
                    className="mr-2 text-orange-500" 
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <Input 
                    placeholder="Pickup Location" 
                    className="pl-10 pr-24"
                    value={searchData.from}
                    onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                  >
                    Use Current
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Input 
                  placeholder="Drop Location" 
                  className="pl-10"
                  value={searchData.to}
                  onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div>
                <DatePicker
                  label="Pickup Date"
                  value={searchData.date}
                  onChange={(date) => setSearchData(prev => ({ ...prev, date: date }))}
                  helperText="Select pickup date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <Input 
                  type="time"
                  value={searchData.time}
                  onChange={(e) => setSearchData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleSearch} size="lg" className="px-12">
                Search Cabs
              </Button>
            </div>
          </div>
        </Card>

        {/* Budget Options */}
        {showBudgetOptions && (
          <Card className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Budget Option</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(budgetOptions).map(([key, option]) => (
                <div
                  key={key}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedBudget === key
                      ? option.color + ' border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedBudget(key as any)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{option.title}</h3>
                    <input
                      type="radio"
                      name="budget"
                      checked={selectedBudget === key}
                      onChange={() => setSelectedBudget(key as any)}
                      className="h-5 w-5 text-orange-600"
                    />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">₹{option.price.toLocaleString()}</p>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="px-12" onClick={handleBooking}>
                Book Selected Option - ₹{budgetOptions[selectedBudget].price.toLocaleString()}
              </Button>
            </div>
          </Card>
        )}

        {/* Popular Routes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Cab Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'Delhi Airport', to: 'Connaught Place', duration: '45 mins', price: '₹800' },
              { from: 'Mumbai Airport', to: 'Bandra', duration: '30 mins', price: '₹600' },
              { from: 'Bangalore Airport', to: 'Koramangala', duration: '1h 15m', price: '₹900' },
              { from: 'Chennai Airport', to: 'T. Nagar', duration: '50 mins', price: '₹700' },
              { from: 'Hyderabad Airport', to: 'Hitech City', duration: '40 mins', price: '₹650' },
              { from: 'Pune Airport', to: 'Hinjewadi', duration: '1h 30m', price: '₹1,200' },
            ].map((route, index) => (
              <Card key={index} hover className="cursor-pointer" onClick={() => handleRouteSelect(route)}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{route.from}</p>
                    <p className="text-sm text-gray-600">to {route.to}</p>
                    <p className="text-xs text-gray-500">{route.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{route.price}</p>
                    <p className="text-xs text-gray-500">Sedan</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended for You */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                service: 'Goa Heritage Tour',
                description: 'Full day sightseeing with guide',
                duration: '8 hours',
                price: '₹2,800',
                discount: '20% OFF',
                vehicle: 'SUV',
                features: ['Professional Guide', 'AC Vehicle', 'Lunch Included'],
                reason: 'Perfect for cultural exploration'
              },
              { 
                service: 'Mumbai City Tour',
                description: 'Explore iconic Mumbai landmarks',
                duration: '6 hours',
                price: '₹2,200',
                discount: '15% OFF',
                vehicle: 'Sedan',
                features: ['Local Guide', 'Multiple Stops', 'Flexible Route'],
                reason: 'Based on your city preferences'
              },
              { 
                service: 'Kerala Backwater Drive',
                description: 'Scenic drive through backwaters',
                duration: '4 hours',
                price: '₹1,500',
                discount: '25% OFF',
                vehicle: 'Hatchback',
                features: ['Scenic Route', 'Photo Stops', 'Local Insights'],
                reason: 'Nature lover special'
              },
            ].map((service, index) => (
              <Card key={index} hover className="cursor-pointer relative" onClick={() => handleRecommendationSelect(service)}>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {service.discount}
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{service.service}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-sm text-gray-600">{service.vehicle} • {service.duration}</p>
                  <p className="text-xs text-blue-600 mt-1">{service.reason}</p>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{service.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-orange-600">{service.price}</p>
                    <p className="text-xs text-gray-500">total cost</p>
                  </div>
                  <Button size="sm">Book Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};