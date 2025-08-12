import React, { useState } from 'react';
import { MagnifyingGlassIcon, UsersIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Building } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DatePicker } from '../components/ui/DatePicker';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const HotelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [selectedBudget, setSelectedBudget] = useState<'cost-effective' | 'luxury' | 'customization'>('cost-effective');
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);

  const budgetOptions = {
    'cost-effective': {
      title: 'Cost Effective',
      price: 2500,
      description: 'Comfortable stay at great value',
      features: [
        'Standard Room',
        'Basic Amenities',
        'WiFi',
        'Daily Housekeeping',
        'Reception Service'
      ],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    'luxury': {
      title: 'Luxury',
      price: 12000,
      description: 'Premium accommodation experience',
      features: [
        'Suite',
        'Premium Amenities',
        'Spa Access',
        'Concierge Service',
        'Fine Dining',
        'Pool & Gym'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    'customization': {
      title: 'Customization',
      price: 6500,
      description: 'Tailored to your preferences',
      features: [
        'Deluxe Room',
        'Enhanced Amenities',
        'Room Service',
        'Gym Access',
        'Restaurant',
        'Flexible Check-in/out'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const handleSearch = () => {
    if (!searchData.location || !searchData.checkIn || !searchData.checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowBudgetOptions(true);
  };

  const handleBooking = () => {
    toast.success(`Hotel booked successfully! ${budgetOptions[selectedBudget].title} package for ₹${budgetOptions[selectedBudget].price.toLocaleString()}`);
    navigate('/bookings');
  };

  const handleDestinationSelect = (destination: any) => {
    setSearchData(prev => ({
      ...prev,
      location: destination.city
    }));
    setShowBudgetOptions(true);
  };

  const handleRecommendationSelect = (hotel: any) => {
    setSearchData(prev => ({
      ...prev,
      location: hotel.location.split(',')[0]
    }));
    setShowBudgetOptions(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Book Hotels</h1>
          </div>
          <p className="text-gray-600">Find the perfect accommodation for your stay</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">City/Hotel</label>
                <Input 
                  placeholder="Goa" 
                  className="pl-10"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div>
                <DatePicker
                  label="Check-in"
                  value={searchData.checkIn}
                  onChange={(date) => setSearchData(prev => ({ ...prev, checkIn: date }))}
                  helperText="Select check-in date"
                />
              </div>
              
              <div>
                <DatePicker
                  label="Check-out"
                  value={searchData.checkOut}
                  onChange={(date) => setSearchData(prev => ({ ...prev, checkOut: date }))}
                  minDate={searchData.checkIn}
                  excludeSameDay={true}
                  helperText="Select check-out date"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                  value={`${searchData.rooms}-${searchData.adults}-${searchData.children}`}
                  onChange={(e) => {
                    const [rooms, adults, children] = e.target.value.split('-').map(Number);
                    setSearchData(prev => ({ ...prev, rooms, adults, children }));
                  }}
                >
                  <option value="1-1-0">1 Room, 1 Adult</option>
                  <option value="1-2-0">1 Room, 2 Adults</option>
                  <option value="1-2-1">1 Room, 2 Adults, 1 Child</option>
                  <option value="2-4-0">2 Rooms, 4 Adults</option>
                  <option value="2-4-2">2 Rooms, 4 Adults, 2 Children</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleSearch} size="lg" className="px-12">
                Search Hotels
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

        {/* Popular Destinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { city: 'Goa', hotels: '1,200+ hotels', price: '₹2,500' },
              { city: 'Mumbai', hotels: '800+ hotels', price: '₹3,200' },
              { city: 'Delhi', hotels: '1,500+ hotels', price: '₹2,800' },
              { city: 'Bangalore', hotels: '900+ hotels', price: '₹2,200' },
              { city: 'Jaipur', hotels: '600+ hotels', price: '₹1,800' },
              { city: 'Kerala', hotels: '700+ hotels', price: '₹3,000' },
            ].map((destination, index) => (
              <Card key={index} hover className="cursor-pointer" onClick={() => handleDestinationSelect(destination)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{destination.city}</p>
                    <p className="text-sm text-gray-600">{destination.hotels}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{destination.price}</p>
                    <p className="text-xs text-gray-500">per night</p>
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
                name: 'The Leela Goa',
                location: 'Cavelossim Beach, Goa',
                price: '₹8,500',
                discount: '25% OFF',
                rating: 4.8,
                amenities: ['Beach Access', 'Spa', 'Pool', 'Fine Dining'],
                reason: 'Matches your luxury preferences'
              },
              { 
                name: 'Taj Lake Palace',
                location: 'Udaipur, Rajasthan',
                price: '₹15,000',
                discount: '20% OFF',
                rating: 4.9,
                amenities: ['Lake View', 'Heritage', 'Spa', 'Royal Dining'],
                reason: 'Perfect for romantic getaway'
              },
              { 
                name: 'Backwater Retreat',
                location: 'Alleppey, Kerala',
                price: '₹4,200',
                discount: '30% OFF',
                rating: 4.6,
                amenities: ['Houseboat', 'Nature View', 'Local Cuisine', 'Ayurveda'],
                reason: 'Based on your nature interests'
              },
            ].map((hotel, index) => (
              <Card key={index} hover className="cursor-pointer relative" onClick={() => handleRecommendationSelect(hotel)}>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {hotel.discount}
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{hotel.name}</p>
                  <p className="text-sm text-gray-600">{hotel.location}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">{hotel.rating}</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">{hotel.reason}</p>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 2).map((amenity, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{hotel.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-orange-600">{hotel.price}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                  <Button onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationSelect(hotel);
                    }}>
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};