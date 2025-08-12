import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';
import { useTrips } from '../hooks/useTrips';
import toast from 'react-hot-toast';

interface TripPlanForm {
  destination: string;
  days: number;
  budget: number;
  interests: string;
}

interface ItineraryActivity {
  name: string;
  location: string;
  duration: string;
  cost: number;
  description: string;
  distance: string;
  timeSlot: string;
  image: string;
  category: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
  totalCost: number;
}

interface ItineraryOption {
  id: string;
  title: string;
  description: string;
  style: string;
  highlights: string[];
  days: ItineraryDay[];
  totalCost: number;
  accommodationType: string;
  transportMode: string;
  uniqueFeature: string;
}

export const TripsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const { selectedCurrency } = useCurrencyStore();
  
  const [formData, setFormData] = useState<TripPlanForm>(() => {
    const planData = location.state?.planData;
    return planData || {
      destination: '',
      days: 5,
      budget: 50000,
      interests: ''
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [itineraryOptions, setItineraryOptions] = useState<ItineraryOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleInputChange = (field: keyof TripPlanForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateMockItineraryOptions = (destination: string, days: number, budget: number, interests: string): ItineraryOption[] => {
    const dailyBudget = Math.floor(budget / days);
    
    const getImageForActivity = (activityName: string, destination: string): string => {
      const images = [
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400'
      ];
      return images[Math.abs(activityName.length + destination.length) % images.length];
    };

    const options: ItineraryOption[] = [
      {
        id: 'budget-explorer',
        title: 'Budget Explorer',
        description: 'Maximum value for money with authentic local experiences',
        style: 'Budget-friendly with local experiences',
        highlights: ['Local markets', 'Street food', 'Public transport', 'Free attractions', 'Budget stays'],
        accommodationType: 'Budget hotels & hostels',
        transportMode: 'Public transport & walking',
        uniqueFeature: 'Local guide recommendations',
        days: [],
        totalCost: 0
      },
      {
        id: 'comfort-traveler',
        title: 'Comfort Traveler',
        description: 'Perfect balance of comfort and exploration',
        style: 'Mid-range comfort with popular attractions',
        highlights: ['Popular attractions', 'Good restaurants', 'Comfortable transport', 'Quality hotels', 'Guided tours'],
        accommodationType: '3-star hotels with amenities',
        transportMode: 'Private cabs & comfortable transport',
        uniqueFeature: 'Curated experiences',
        days: [],
        totalCost: 0
      },
      {
        id: 'luxury-experience',
        title: 'Luxury Experience',
        description: 'Premium experiences with top-tier services',
        style: 'High-end luxury with exclusive experiences',
        highlights: ['Premium hotels', 'Fine dining', 'Private tours', 'Exclusive access', 'Luxury transport'],
        accommodationType: '5-star luxury resorts',
        transportMode: 'Private luxury vehicles',
        uniqueFeature: 'VIP access & concierge service',
        days: [],
        totalCost: 0
      },
      {
        id: 'adventure-seeker',
        title: 'Adventure Seeker',
        description: 'Thrilling activities and off-the-beaten-path experiences',
        style: 'Adventure-focused with unique experiences',
        highlights: ['Adventure sports', 'Hidden gems', 'Local guides', 'Unique experiences', 'Outdoor activities'],
        accommodationType: 'Adventure lodges & camps',
        transportMode: 'Adventure vehicles & trekking',
        uniqueFeature: 'Extreme sports & wilderness',
        days: [],
        totalCost: 0
      }
    ];

    const getOptionMultiplier = (optionId: string): number => {
      const multipliers = {
        'budget-explorer': 0.7,
        'comfort-traveler': 1.0,
        'luxury-experience': 1.5,
        'adventure-seeker': 0.9
      };
      return multipliers[optionId] || 1.0;
    };

    const getActivityByType = (dest: string, timeSlot: string, optionId: string, day: number): string => {
      const destLower = dest.toLowerCase();
      
      const activities: Record<string, Record<string, string[]>> = {
        "goa": {
          "morning": [
            "Beach Walk and Sunrise", "Portuguese Church Visit", "Spice Plantation Tour", 
            "Local Market Exploration", "Heritage Walk in Old Goa"
          ],
          "afternoon": [
            "Water Sports at Baga Beach", "Dudhsagar Waterfall Trek", "Anjuna Flea Market", 
            "Fort Aguada Exploration", "River Cruise"
          ],
          "evening": [
            "Sunset at Chapora Fort", "Beach Shack Dinner", "Night Market Shopping", 
            "Casino Experience", "Beach Party"
          ]
        },
        "dubai": {
          "morning": [
            "Burj Khalifa Observation Deck", "Dubai Mall Exploration", "Gold Souk Visit", 
            "Dubai Creek Tour", "Jumeirah Mosque Visit"
          ],
          "afternoon": [
            "Desert Safari Adventure", "Dubai Marina Walk", "Palm Jumeirah Tour", 
            "Atlantis Aquarium", "Dubai Frame Visit"
          ],
          "evening": [
            "Dubai Fountain Show", "Rooftop Dining", "Souk Madinat Shopping", 
            "Dhow Cruise Dinner", "Burj Al Arab View"
          ]
        },
        "kerala": {
          "morning": [
            "Backwater Houseboat Cruise", "Tea Plantation Visit", "Spice Garden Tour", 
            "Kathakali Performance", "Fort Kochi Walk"
          ],
          "afternoon": [
            "Munnar Hill Station", "Periyar Wildlife Sanctuary", "Chinese Fishing Nets", 
            "Ayurvedic Spa Treatment", "Bamboo Rafting"
          ],
          "evening": [
            "Sunset at Marine Drive", "Traditional Kerala Dinner", "Cultural Show", 
            "Beach Walk at Kovalam", "Local Market Visit"
          ]
        }
      };

      const defaultActivities = {
        "morning": [`Morning Sightseeing in ${dest}`, `Local Market Visit`, `Cultural Site Tour`],
        "afternoon": [`Main Attraction Visit`, `Adventure Activity`, `Museum Tour`],
        "evening": [`Sunset Viewing`, `Local Dining Experience`, `Evening Entertainment`]
      };

      const destActivities = activities[destLower] || defaultActivities;
      const timeActivities = destActivities[timeSlot] || defaultActivities[timeSlot];
      
      let activity = timeActivities[(day - 1) % timeActivities.length];
      
      if (optionId === "budget-explorer") {
        activity = activity.replace("Premium", "Local").replace("Luxury", "Budget");
      } else if (optionId === "luxury-experience") {
        activity = activity.startsWith("Premium") ? activity : `Premium ${activity}`;
      } else if (optionId === "adventure-seeker" && timeSlot === "afternoon") {
        activity = activity.toLowerCase().includes("adventure") ? activity : `Adventure ${activity}`;
      }
      
      return activity;
    };

    const getLocationName = (dest: string, day: number, timeSlot: string): string => {
      const locations = {
        "goa": ["Baga Beach", "Old Goa", "Anjuna", "Calangute", "Palolem", "Arambol"],
        "dubai": ["Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Deira", "JBR", "Business Bay"],
        "kerala": ["Fort Kochi", "Alleppey", "Munnar", "Thekkady", "Kovalam", "Wayanad"]
      };
      
      const destLocations = locations[dest.toLowerCase()] || [`${dest} Center`, `${dest} District`];
      return destLocations[(day - 1 + (timeSlot === 'afternoon' ? 1 : timeSlot === 'evening' ? 2 : 0)) % destLocations.length];
    };

    // Generate activities for each option
    options.forEach((option) => {
      for (let day = 1; day <= days; day++) {
        const dayBudget = dailyBudget * getOptionMultiplier(option.id);
        const dayActivities: ItineraryActivity[] = [];
        
        // Morning activity
        const morningActivity = getActivityByType(destination, 'morning', option.id, day);
        dayActivities.push({
          name: morningActivity,
          location: getLocationName(destination, day, 'morning'),
          duration: '2-3 hours',
          cost: Math.floor(dayBudget * 0.3),
          description: `Start your day exploring the cultural and historical aspects of ${destination}`,
          distance: `${Math.floor(Math.random() * 10) + 1} km`,
          timeSlot: '9:00 AM - 12:00 PM',
          image: getImageForActivity(morningActivity, destination),
          category: 'Culture'
        });

        // Afternoon activity
        const afternoonActivity = getActivityByType(destination, 'afternoon', option.id, day);
        dayActivities.push({
          name: afternoonActivity,
          location: getLocationName(destination, day, 'afternoon'),
          duration: '3-4 hours',
          cost: Math.floor(dayBudget * 0.4),
          description: `Experience the main attractions and activities that ${destination} is famous for`,
          distance: `${Math.floor(Math.random() * 15) + 2} km`,
          timeSlot: '1:00 PM - 5:00 PM',
          image: getImageForActivity(afternoonActivity, destination),
          category: 'Adventure'
        });

        // Evening activity
        const eveningActivity = getActivityByType(destination, 'evening', option.id, day);
        dayActivities.push({
          name: eveningActivity,
          location: getLocationName(destination, day, 'evening'),
          duration: '2-3 hours',
          cost: Math.floor(dayBudget * 0.3),
          description: `Enjoy the nightlife and dining scene of ${destination}`,
          distance: `${Math.floor(Math.random() * 8) + 1} km`,
          timeSlot: '6:00 PM - 9:00 PM',
          image: getImageForActivity(eveningActivity, destination),
          category: 'Entertainment'
        });

        const dayTotalCost = dayActivities.reduce((sum, activity) => sum + activity.cost, 0);

        option.days.push({
          day,
          title: `Day ${day} - ${getDayTitle(destination, day, option.id)}`,
          activities: dayActivities,
          totalCost: dayTotalCost
        });
      }
      
      option.totalCost = option.days.reduce((sum, day) => sum + day.totalCost, 0);
    });

    return options;
  };

  const getDayTitle = (destination: string, day: number, optionId: string): string => {
    const titles = {
      1: "Arrival and City Exploration",
      2: "Main Attractions Tour", 
      3: "Cultural Immersion",
      4: "Adventure and Nature",
      5: "Relaxation and Shopping",
      6: "Hidden Gems Discovery",
      7: "Farewell and Departure"
    };
    
    const baseTitle = titles[day] || `Day ${day} Exploration`;
    
    if (optionId === "luxury-experience") {
      return `Luxury ${baseTitle}`;
    } else if (optionId === "adventure-seeker") {
      return `Adventure ${baseTitle}`;
    } else if (optionId === "budget-explorer") {
      return `Local ${baseTitle}`;
    }
    
    return baseTitle;
  };

  const handleSuggestItinerary = async () => {
    if (!formData.destination || !formData.days || !formData.budget) {
      toast.error('Please fill in destination, days, and budget');
      return;
    }

    setLoading(true);
    try {
      // Generate mock itinerary options
      const mockOptions = generateMockItineraryOptions(formData.destination, formData.days, formData.budget, formData.interests);
      setItineraryOptions(mockOptions);
      setSelectedOption(mockOptions[0]?.id || '');
      
      toast.success('Itinerary options generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTrips = async () => {
    if (!selectedItinerary) {
      toast.error('Please select an itinerary option first');
      return;
    }

    try {
      const tripData = {
        title: `${formData.destination} - ${selectedItinerary.title}`,
        description: `${formData.days}-day trip to ${formData.destination} with ${selectedItinerary.style.toLowerCase()}`,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + (7 + formData.days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelerCount: 1,
        totalBudget: selectedItinerary.totalCost,
        currency: selectedCurrency.code,
        privacyLevel: 'private' as const
      };

      await createTrip(tripData);
      toast.success('Trip saved successfully!');
      navigate('/my-trips');
    } catch (error) {
      toast.error('Failed to save trip');
    }
  };

  const handleBookServices = () => {
    if (!selectedItinerary) {
      toast.error('Please select an itinerary option first');
      return;
    }
    
    navigate('/book/itinerary', { 
      state: { 
        destination: formData.destination,
        itinerary: selectedItinerary,
        totalAmount: selectedItinerary.totalCost
      } 
    });
  };

  const handleRegenerateItinerary = () => {
    setItineraryOptions([]);
    setSelectedOption('');
    handleSuggestItinerary();
  };

  // Auto-generate itinerary if we have plan data from homepage
  useEffect(() => {
    if (location.state?.planData && !itineraryOptions.length) {
      handleSuggestItinerary();
    }
  }, [location.state?.planData]);

  const selectedItinerary = itineraryOptions.find(option => option.id === selectedOption);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Trip Planner</h1>
          </div>
          <p className="text-gray-600">Let our AI create the perfect itinerary for your dream trip</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Planning Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Your Trip</h2>
              
              <div className="space-y-6">
                <div>
                  <Input
                    label="Destination"
                    placeholder="e.g., Goa, Dubai, Bangkok"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Number of Days"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div>
                  <Input
                    label={`Budget (${selectedCurrency.code})`}
                    type="number"
                    min="1000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                    placeholder="50000"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Total budget for the entire trip
                  </p>
                </div>

                <div>
                  <Textarea
                    label="Interests & Activities"
                    placeholder="e.g., beaches, temples, nightlife, adventure sports, local cuisine, shopping"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    rows={4}
                    helperText="Separate multiple interests with commas"
                  />
                </div>

                <Button
                  onClick={handleSuggestItinerary}
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate AI Itinerary
                </Button>

                {/* Quick Examples */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Examples:</h4>
                  <div className="space-y-2">
                    {[
                      { destination: 'Goa', days: 5, budget: 25000, interests: 'beaches, nightlife, seafood' },
                      { destination: 'Dubai', days: 7, budget: 80000, interests: 'shopping, luxury, architecture' },
                      { destination: 'Kerala', days: 6, budget: 35000, interests: 'backwaters, ayurveda, nature' }
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData(example)}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                      >
                        <span className="font-medium">{example.destination}</span> • {example.days} days • ₹{example.budget.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Itinerary Display */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Itinerary</h3>
                <p className="text-gray-600">Our AI is creating the perfect trip plan for you...</p>
              </Card>
            ) : itineraryOptions.length > 0 ? (
              <div className="space-y-6">
                {/* Itinerary Header */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{formData.destination} Itinerary Options</h2>
                      <p className="text-gray-600">{formData.days} days • Budget: {formatPrice(formData.budget, selectedCurrency)}</p>
                    </div>
                  </div>
                  
                  {formData.interests && (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.split(',').map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Option Selection */}
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Travel Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itineraryOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedOption === option.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedOption(option.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{option.title}</h4>
                          <input
                            type="radio"
                            name="itinerary-option"
                            checked={selectedOption === option.id}
                            onChange={() => setSelectedOption(option.id)}
                            className="h-4 w-4 text-orange-600"
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {option.highlights.map((highlight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(option.totalCost, selectedCurrency)}
                          </p>
                          <p className="text-xs text-gray-500">total estimated cost</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Selected Itinerary Details */}
                {selectedItinerary && (
                  <div className="space-y-4">
                    {selectedItinerary.days.map((day) => (
                      <Card key={day.day}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {day.title}
                          </h3>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Day Budget</p>
                            <p className="font-semibold text-green-600">
                              {formatPrice(day.totalCost, selectedCurrency)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex space-x-3 flex-1">
                                  <img
                                    src={activity.image}
                                    alt={activity.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">{activity.name}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                      <div className="flex items-center">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        <span>{activity.location}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        <span>{activity.duration}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapIcon className="h-4 w-4 mr-1" />
                                        <span className="font-medium text-blue-600">{activity.distance}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                                    <div className="flex items-center space-x-2">
                                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {activity.timeSlot}
                                      </span>
                                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                        {activity.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-semibold text-orange-600">
                                    {formatPrice(activity.cost, selectedCurrency)}
                                  </p>
                                  <p className="text-xs text-gray-500">per person</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}

                    {/* Action Buttons */}
                    <Card>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          className="flex-1"
                          onClick={handleSaveToTrips}
                        >
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          Save to My Trips
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleBookServices}
                        >
                          <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                          Book Services
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleRegenerateItinerary}
                        >
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-12">
                <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Plan Your Trip?</h3>
                <p className="text-gray-600 mb-6">
                  Fill in your preferences on the left and let our AI create 4 personalized itinerary options for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-900">Budget Explorer</h4>
                    <p className="text-sm text-green-700">Local experiences & great value</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900">Comfort Traveler</h4>
                    <p className="text-sm text-blue-700">Perfect balance of comfort & exploration</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <StarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-900">Luxury Experience</h4>
                    <p className="text-sm text-purple-700">Premium services & exclusive access</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <SparklesIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-orange-900">Adventure Seeker</h4>
                    <p className="text-sm text-orange-700">Thrilling activities & unique experiences</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};