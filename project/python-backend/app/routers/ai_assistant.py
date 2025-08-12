import React, { useState } from 'react';
import { 
  MapIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { aiAPI } from '../services/api';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';

interface TripPlanForm {
  destination: string;
  days: number;
  budget: number;
  interests: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    name: string;
    location: string;
    duration: string;
    cost: number;
    description: string;
    distance?: string;
  }[];
  totalCost: number;
}

export const PlanTripPage: React.FC = () => {
  const [formData, setFormData] = useState<TripPlanForm>({
    destination: '',
    days: 5,
    budget: 50000,
    interests: ''
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string>('');
  const [structuredItinerary, setStructuredItinerary] = useState<ItineraryDay[]>([]);
  const { selectedCurrency } = useCurrencyStore();

  const handleInputChange = (field: keyof TripPlanForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const parseItineraryFromAI = (aiResponse: string): ItineraryDay[] => {
    // Try to extract structured data from AI response
    // This is a simplified parser - in production, you'd want more robust parsing
    const lines = aiResponse.split('\n');
    const days: ItineraryDay[] = [];
    let currentDay: ItineraryDay | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for day headers (e.g., "Day 1:", "Day 2:", etc.)
      const dayMatch = trimmedLine.match(/^Day (\d+)[:.]?\s*(.*)$/i);
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          day: parseInt(dayMatch[1]),
          title: dayMatch[2] || `Day ${dayMatch[1]}`,
          activities: [],
          totalCost: 0
        };
        continue;
      }

      // Check for activities (lines starting with -, •, or numbers)
      const activityMatch = trimmedLine.match(/^[-•\d\.]\s*(.+)$/);
      if (activityMatch && currentDay) {
        const activityText = activityMatch[1];
        
        // Try to extract cost from the activity text
        const costMatch = activityText.match(/₹(\d+(?:,\d+)*)/);
        const cost = costMatch ? parseInt(costMatch[1].replace(/,/g, '')) : 0;
        
        // Extract location if mentioned in parentheses
        const locationMatch = activityText.match(/\(([^)]+)\)/);
        const location = locationMatch ? locationMatch[1] : 'City Center';
        
        currentDay.activities.push({
          name: activityText.replace(/\(([^)]+)\)/, '').replace(/₹\d+(?:,\d+)*/, '').trim(),
          location: location,
          duration: '2-3 hours', // Default duration
          cost: cost,
          description: activityText,
          distance: Math.floor(Math.random() * 15) + 1 + ' km' // Mock distance for now
        });
        
        currentDay.totalCost += cost;
      }
    }

    if (currentDay) {
      days.push(currentDay);
    }

    return days;
  };

  const handleSuggestItinerary = async () => {
    if (!formData.destination || !formData.days || !formData.budget) {
      toast.error('Please fill in destination, days, and budget');
      return;
    }

    setLoading(true);
    try {
      const interestsArray = formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      const response = await aiAPI.suggestItinerary(
        formData.destination,
        formData.days,
        formData.budget,
        interestsArray
      );

      setItinerary(response.itinerary);
      
      // Parse the AI response into structured data
      const parsedItinerary = parseItineraryFromAI(response.itinerary);
      setStructuredItinerary(parsedItinerary);
      
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
      
      // Fallback to mock itinerary for demo
      const mockItinerary = generateMockItinerary(formData.destination, formData.days, formData.budget);
      setStructuredItinerary(mockItinerary);
      setItinerary(`Generated itinerary for ${formData.destination} - ${formData.days} days with budget ${formatPrice(formData.budget, selectedCurrency)}`);
    } finally {
      setLoading(false);
    }
  };

  const generateMockItinerary = (destination: string, days: number, budget: number): ItineraryDay[] => {
    const mockDays: ItineraryDay[] = [];
    
    for (let i = 1; i <= days; i++) {
      mockDays.push({
        day: i,
        title: `Day ${i} - Explore ${destination}`,
        activities: [
          {
            name: `Morning Activity ${i}`,
            location: 'City Center',
            duration: '2-3 hours',
            cost: Math.floor(budget / days * 0.3),
            description: `Explore the main attractions of ${destination}`,
            distance: '0.5 km'
          },
          {
            name: `Afternoon Experience ${i}`,
            location: 'Tourist District',
            duration: '3-4 hours',
            cost: Math.floor(budget / days * 0.4),
            description: `Cultural and historical sites visit`,
            distance: '2.3 km'
          },
          {
            name: `Evening Activity ${i}`,
            location: 'Entertainment Area',
            duration: '2-3 hours',
            cost: Math.floor(budget / days * 0.3),
            description: `Local dining and entertainment`,
            distance: '1.8 km'
          }
        ],
        totalCost: Math.floor(budget / days)
      });
    }
    
    return mockDays;
  };

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
                      { dest: 'Goa', days: 5, budget: 25000, interests: 'beaches, nightlife, seafood' },
                      { dest: 'Dubai', days: 7, budget: 80000, interests: 'shopping, luxury, architecture' },
                      { dest: 'Kerala', days: 6, budget: 35000, interests: 'backwaters, ayurveda, nature' }
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData(example)}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                      >
                        <span className="font-medium">{example.dest}</span> • {example.days} days • ₹{example.budget.toLocaleString()}
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
            ) : structuredItinerary.length > 0 ? (
              <div className="space-y-6">
                {/* Itinerary Header */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{formData.destination} Itinerary</h2>
                      <p className="text-gray-600">{formData.days} days • Budget: {formatPrice(formData.budget, selectedCurrency)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Total Cost</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatPrice(structuredItinerary.reduce((sum, day) => sum + day.totalCost, 0), selectedCurrency)}
                      </p>
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

                {/* Day-by-Day Itinerary */}
                {structuredItinerary.map((day) => (
                  <Card key={day.day}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Day {day.day}: {day.title}
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
                                {activity.distance && (
                                  <div className="flex items-center">
                                    <MapIcon className="h-4 w-4 mr-1" />
                                    <span>{activity.distance} from center</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{activity.description}</p>
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
                    <Button className="flex-1">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Save to My Trips
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      Book Services
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Plan Your Trip?</h3>
                <p className="text-gray-600 mb-6">
                  Fill in your preferences on the left and let our AI create a personalized itinerary for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900">Smart Destinations</h4>
                    <p className="text-sm text-blue-700">AI suggests the best places to visit</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-900">Budget Optimization</h4>
                    <p className="text-sm text-green-700">Maximize your experience within budget</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <StarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-900">Personalized</h4>
                    <p className="text-sm text-purple-700">Tailored to your interests and style</p>
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