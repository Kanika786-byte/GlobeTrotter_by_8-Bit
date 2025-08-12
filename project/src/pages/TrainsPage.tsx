import React, { useState } from 'react';
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Train } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DatePicker } from '../components/ui/DatePicker';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const TrainsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    class: 'sleeper'
  });
  const [selectedBudget, setSelectedBudget] = useState<'cost-effective' | 'luxury' | 'customization'>('cost-effective');
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);

  const budgetOptions = {
    'cost-effective': {
      title: 'Cost Effective',
      price: 1200,
      description: 'Affordable train travel',
      features: [
        'Sleeper Class',
        'Basic Bedding',
        'Meals Available',
        'Charging Points',
        'Standard Service'
      ],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    'luxury': {
      title: 'Luxury',
      price: 4500,
      description: 'Premium train experience',
      features: [
        'First AC',
        'Premium Bedding',
        'Gourmet Meals',
        'Personal Attendant',
        'Priority Boarding',
        'Lounge Access'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    'customization': {
      title: 'Customization',
      price: 2800,
      description: 'Tailored journey experience',
      features: [
        'Second AC',
        'Comfortable Bedding',
        'Quality Meals',
        'Priority Booking',
        'Flexible Timing',
        'Extra Amenities'
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
    toast.success(`Train booked successfully! ${budgetOptions[selectedBudget].title} package for ₹${budgetOptions[selectedBudget].price.toLocaleString()}`);
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
            <Train className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Book Trains</h1>
          </div>
          <p className="text-gray-600">Travel comfortably across India by train</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Input 
                  placeholder="New Delhi" 
                  className="pl-10"
                  value={searchData.from}
                  onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Input 
                  placeholder="Mumbai Central" 
                  className="pl-10"
                  value={searchData.to}
                  onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
              </div>
              
              <div>
                <DatePicker
                  label="Journey Date"
                  value={searchData.date}
                  onChange={(date) => setSearchData(prev => ({ ...prev, date: date }))}
                  helperText="Select your travel date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                  value={searchData.class}
                  onChange={(e) => setSearchData(prev => ({ ...prev, class: e.target.value }))}
                >
                  <option value="sleeper">Sleeper</option>
                  <option value="3ac">3AC</option>
                  <option value="2ac">2AC</option>
                  <option value="1ac">1AC</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleSearch} size="lg" className="px-12">
                Search Trains
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Train Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'Delhi', to: 'Mumbai', duration: '16h 35m', price: '₹1,200' },
              { from: 'Mumbai', to: 'Bangalore', duration: '24h 10m', price: '₹1,500' },
              { from: 'Delhi', to: 'Kolkata', duration: '17h 20m', price: '₹1,100' },
              { from: 'Chennai', to: 'Hyderabad', duration: '12h 45m', price: '₹800' },
              { from: 'Mumbai', to: 'Goa', duration: '11h 30m', price: '₹900' },
              { from: 'Delhi', to: 'Jaipur', duration: '4h 50m', price: '₹400' },
            ].map((route, index) => (
              <Card key={index} hover className="cursor-pointer" onClick={() => handleRouteSelect(route)}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                    <p className="text-sm text-gray-600">{route.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{route.price}</p>
                    <p className="text-xs text-gray-500">Sleeper</p>
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
                to: 'Rishikesh', 
                duration: '6h 20m', 
                price: '₹650',
                discount: '22% OFF',
                train: 'Dehradun Express',
                class: '3AC',
                reason: 'Perfect for spiritual journey'
              },
              { 
                from: 'Mumbai', 
                to: 'Udaipur', 
                duration: '12h 15m', 
                price: '₹1,800',
                discount: '18% OFF',
                train: 'Mewar Express',
                class: '2AC',
                reason: 'Heritage route recommendation'
              },
              { 
                from: 'Chennai', 
                to: 'Rameswaram', 
                duration: '8h 45m', 
                price: '₹950',
                discount: '25% OFF',
                train: 'Rameswaram Express',
                class: 'Sleeper',
                reason: 'Scenic coastal journey'
              },
            ].map((route, index) => (
              <Card key={index} hover className="cursor-pointer relative" onClick={() => handleRecommendationSelect(route)}>
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {route.discount}
                </div>
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                  <p className="text-sm text-gray-600">{route.train} • {route.class}</p>
                  <p className="text-sm text-gray-600">{route.duration}</p>
                  <p className="text-xs text-blue-600 mt-1">{route.reason}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-orange-600">{route.price}</p>
                    <p className="text-xs text-gray-500">{route.class}</p>
                  </div>
                  <Button onClick={(e) => {
                      e.stopPropagation();
                      handleRecommendationSelect(route);
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