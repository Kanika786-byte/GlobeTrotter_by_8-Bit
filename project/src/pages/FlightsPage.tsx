import React, { useState } from 'react';
import { MagnifyingGlassIcon, UsersIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Plane } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DatePicker } from '../components/ui/DatePicker';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const FlightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    travelers: 1,
    class: 'economy'
  });
  const [selectedBudget, setSelectedBudget] = useState<'cost-effective' | 'luxury' | 'customization'>('cost-effective');
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);

  const handleSearch = () => {
    if (!searchData.from || !searchData.to || !searchData.departure) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowBudgetOptions(true);
  };

  const budgetOptions = {
    'cost-effective': {
      title: 'Cost Effective',
      price: 8500,
      description: 'Best value for money',
      features: [
        'Economy Class',
        'Basic Meal',
        '20kg Baggage',
        'Standard Seat',
        'Online Check-in'
      ],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    'luxury': {
      title: 'Luxury',
      price: 25000,
      description: 'Premium travel experience',
      features: [
        'Business Class',
        'Premium Meal',
        '40kg Baggage',
        'Priority Boarding',
        'Lounge Access',
        'Extra Legroom'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    'customization': {
      title: 'Customization',
      price: 18000,
      description: 'Tailored to your preferences',
      features: [
        'Premium Economy',
        'Meal Choice',
        '30kg Baggage',
        'Seat Selection',
        'Fast Track',
        'Flexible Booking'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const handleBooking = () => {
    toast.success(`Flight booked successfully! ${budgetOptions[selectedBudget].title} package for ₹${budgetOptions[selectedBudget].price.toLocaleString()}`);
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

  const handleRecommendationSelect = (route: any) => {
    setSearchData(prev => ({
      ...prev,
      from: route.from,
      to: route.to
    }));
    setShowBudgetOptions(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Book Flights</h1>
          </div>
          <p className="text-gray-600">Find the best flight deals for your journey</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Input 
                  placeholder="Delhi" 
                  className="pl-10"
                  value={searchData.from}
                  onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Input 
                  placeholder="Mumbai" 
                  className="pl-10"
                  value={searchData.to}
                  onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div>
                <DatePicker
                  label="Departure"
                  value={searchData.departure}
                  onChange={(date) => setSearchData(prev => ({ ...prev, departure: date }))}
                  helperText="Select your departure date"
                />
              </div>
              
              <div>
                <DatePicker
                  label="Return (Optional)"
                  value={searchData.return}
                  onChange={(date) => setSearchData(prev => ({ ...prev, return: date }))}
                  minDate={searchData.departure}
                  excludeSameDay={true}
                  helperText="Select your return date"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                  value={searchData.travelers}
                  onChange={(e) => setSearchData(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4+ Adults</option>
                </select>
              </div>
              
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                value={searchData.class}
                onChange={(e) => setSearchData(prev => ({ ...prev, class: e.target.value }))}
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div className="text-center">
              <Button onClick={handleSearch} size="lg" className="px-12">
                Search Flights
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'Delhi', to: 'Mumbai', price: '₹4,500' },
              { from: 'Mumbai', to: 'Bangalore', price: '₹3,200' },
              { from: 'Delhi', to: 'Goa', price: '₹6,800' },
              { from: 'Chennai', to: 'Hyderabad', price: '₹2,900' },
              { from: 'Kolkata', to: 'Delhi', price: '₹5,100' },
              { from: 'Pune', to: 'Chennai', price: '₹4,200' },
            ].map((route, index) => (
              <Card key={index} hover className="cursor-pointer" onClick={() => handleRouteSelect(route)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                    <p className="text-sm text-gray-600">Starting from</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{route.price}</p>
                    <p className="text-xs text-gray-500">per person</p>
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
                from: 'Delhi', 
                to: 'Dubai', 
                price: '₹18,500', 
                discount: '15% OFF',
                airline: 'Emirates',
                duration: '3h 30m',
                reason: 'International destination match'
              },
              { 
                from: 'Mumbai', 
                to: 'Singapore', 
                price: '₹22,000', 
                discount: '20% OFF',
                airline: 'Singapore Airlines',
                duration: '5h 45m',
                reason: 'Based on your travel history'
              },
              { 
                from: 'Bangalore', 
                to: 'Bangkok', 
                price: '₹16,800', 
                discount: '18% OFF',
                airline: 'Thai Airways',
                duration: '4h 15m',
                reason: 'Popular with similar travelers'
              },
            ].map((route, index) => (
              <Card key={index} hover className="cursor-pointer relative" onClick={() => handleRecommendationSelect(route)}>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {route.discount}
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                  <p className="text-sm text-gray-600">{route.airline} • {route.duration}</p>
                  <p className="text-xs text-blue-600 mt-1">{route.reason}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{route.price}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <Button onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationSelect(route);
                    }} size="sm">Book Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};