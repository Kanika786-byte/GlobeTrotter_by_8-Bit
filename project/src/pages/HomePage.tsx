import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapIcon, 
  StarIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const { selectedCurrency } = useCurrencyStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [planData, setPlanData] = useState({
    destination: '',
    days: 5,
    budget: 50000,
    interests: ''
  });

  const handlePlanTrip = () => {
    if (!planData.destination || !planData.days || !planData.budget) {
      toast.error('Please fill in destination, days, and budget');
      return;
    }
    
    navigate('/trips', { state: { planData } });
  };

  const handleDestinationClick = (destination: any) => {
    navigate(`/destinations/${destination.name.toLowerCase()}`, {
      state: { destination }
    });
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/trips');
    } else {
      navigate('/register');
    }
  };

  const handleQuickExample = (example: any) => {
    setPlanData(example);
    navigate('/trips', { state: { planData: example } });
  };

  const popularDestinations = [
    {
      name: 'Goa',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      price: 3500,
      discount: '20% OFF',
    },
    {
      name: 'Dubai',
      image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      price: 15000,
      discount: '15% OFF',
    },
    {
      name: 'Thailand',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      price: 12000,
      discount: '25% OFF',
    },
    {
      name: 'Singapore',
      image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      price: 18000,
      discount: '10% OFF',
    },
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Planning',
      description: 'Get personalized itineraries created by our advanced AI based on your preferences and budget.',
    },
    {
      icon: MapIcon,
      title: 'Complete Trip Management',
      description: 'Plan, book, and manage your entire trip from flights to activities in one place.',
    },
    {
      icon: StarIcon,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from millions of travelers with sentiment analysis.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Budget Optimization',
      description: 'Smart budget allocation across accommodations, transport, and activities.',
    },
    {
      icon: MapPinIcon,
      title: 'Local Insights',
      description: 'Discover hidden gems and local experiences recommended by our AI.',
    },
    {
      icon: ClockIcon,
      title: 'Real-time Updates',
      description: 'Get live updates on prices, availability, and travel conditions.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Booking Widget */}
      <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI-Powered Travel Planning
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Let AI Create Your Perfect Trip Itinerary
            </p>
          </div>

          {/* Trip Planning Widget */}
          <div className="max-w-6xl mx-auto">
            <Card className="p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <SparklesIcon className="h-8 w-8 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Plan Your Dream Trip</h2>
                </div>
                <p className="text-gray-600">Tell us your preferences and let our AI create the perfect itinerary</p>
              </div>
              
              {/* Trip Planning Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <Input
                    label="Destination"
                    placeholder="e.g., Goa, Dubai, Bangkok"
                    value={planData.destination}
                    onChange={(e) => setPlanData(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Input
                    label="Number of Days"
                    type="number"
                    min="1"
                    max="30"
                    value={planData.days}
                    onChange={(e) => setPlanData(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                
                <div>
                  <Input
                    label={`Budget (${selectedCurrency.code})`}
                    type="number"
                    min="1000"
                    value={planData.budget}
                    onChange={(e) => setPlanData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                    onChange={(e) => setPlanData(prev => ({ ...prev, interests: e.target.value }))}
                  >
                    <option value="">Select style</option>
                    <option value="adventure, outdoor, hiking">Adventure & Outdoor</option>
                    <option value="culture, history, museums">Culture & History</option>
                    <option value="beach, relaxation, spa">Beach & Relaxation</option>
                    <option value="food, nightlife, entertainment">Food & Nightlife</option>
                    <option value="luxury, shopping, premium">Luxury & Shopping</option>
                    <option value="family, kids, activities">Family & Kids</option>
                  </select>
                </div>
              </div>

              {/* Interests Textarea */}
              <div className="mb-6">
                <Textarea
                  label="Additional Interests (Optional)"
                  placeholder="e.g., photography, local cuisine, temples, adventure sports, shopping..."
                  value={planData.interests}
                  onChange={(e) => setPlanData(prev => ({ ...prev, interests: e.target.value }))}
                  rows={2}
                  helperText="Describe what you'd like to experience during your trip"
                />
              </div>

              {/* Plan Trip Button */}
              <div className="text-center">
                <Button 
                  onClick={handlePlanTrip}
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-12 py-4 text-lg font-semibold"
                >
                  <SparklesIcon className="h-6 w-6 mr-2" />
                  PLAN MY TRIP
                </Button>
              </div>
              
              {/* Quick Examples */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">Quick Examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { destination: 'Goa', days: 5, budget: 25000, interests: 'beaches, nightlife, seafood' },
                    { destination: 'Dubai', days: 7, budget: 80000, interests: 'shopping, luxury, architecture' },
                    { destination: 'Kerala', days: 6, budget: 35000, interests: 'backwaters, ayurveda, nature' }
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickExample(example)}
                      className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                    >
                      <p className="font-medium text-gray-900">{example.destination}</p>
                      <p className="text-sm text-gray-600">{example.days} days • ₹{example.budget.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{example.interests}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Explore amazing places with exclusive deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <Card 
                onClick={() => handleDestinationClick(destination)}
                key={index} 
                padding="none" 
                hover 
                className="overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {destination.discount}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl mb-1">{destination.name}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{destination.rating}</span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold">{formatPrice(destination.price, selectedCurrency)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Use AI Trip Planning?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of travel planning with artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Travel Services
            </h2>
            <p className="text-xl text-gray-600">
              Book everything you need for your trip
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Flights', icon: '✈️', href: '/flights', description: 'Domestic & International' },
              { name: 'Hotels', icon: '🏨', href: '/hotels', description: 'Budget to Luxury' },
              { name: 'Trains', icon: '🚂', href: '/trains', description: 'Comfortable Rail Travel' },
              { name: 'Cabs', icon: '🚗', href: '/cabs', description: 'Local & Outstation' }
            ].map((service, index) => (
              <Link key={index} to={service.href}>
                <Card hover className="text-center p-6 cursor-pointer">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-xl font-semibold text-gray-900">4.8/5</span>
              <span className="text-gray-600">(2.5M+ Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                review: "The AI trip planner created an amazing 5-day Goa itinerary that perfectly matched my budget and interests. Every recommendation was spot-on!",
                service: "AI Trip Planning"
              },
              {
                name: "Rajesh Kumar",
                location: "Delhi",
                rating: 5,
                review: "Saved hours of research! The AI suggested destinations I never would have considered, and the detailed itinerary made planning effortless.",
                service: "AI Recommendations"
              },
              {
                name: "Anita Patel",
                location: "Bangalore",
                rating: 4,
                review: "The AI understood our family needs perfectly and created a kid-friendly Kerala itinerary with the right balance of activities and rest time.",
                service: "Family Trip Planning"
              }
            ].map((review, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-3">"{review.review}"</p>
                
                <div className="text-sm text-orange-600 font-medium">
                  {review.service}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience AI Trip Planning?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of travelers who trust our AI to plan their perfect trips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              {user ? 'Plan Your Trip' : 'Get Started Free'}
            </Button>
            <Link to="/plan-trip" className="inline-block">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg">
                Try AI Planner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};