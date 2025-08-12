import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { DatePicker } from '../components/ui/DatePicker';
import { StripePayment } from '../components/payment';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';

interface BookingDetails {
  travelers: number;
  startDate: string;
  endDate: string;
  specialRequests: string;
  contactEmail: string;
  contactPhone: string;
}

export const ItineraryBookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, itinerary, totalAmount } = location.state || {};
  const { selectedCurrency } = useCurrencyStore();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    travelers: 1,
    startDate: '',
    endDate: '',
    specialRequests: '',
    contactEmail: '',
    contactPhone: ''
  });

  if (!itinerary || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking data not found</h3>
          <Button onClick={() => navigate('/trips')}>Back to Trip Planning</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof BookingDetails, value: string | number) => {
    setBookingDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateBookingDetails = (): boolean => {
    if (!bookingDetails.travelers || bookingDetails.travelers < 1) {
      toast.error('Please enter number of travelers');
      return false;
    }
    if (!bookingDetails.startDate) {
      toast.error('Please select start date');
      return false;
    }
    if (!bookingDetails.endDate) {
      toast.error('Please select end date');
      return false;
    }
    if (!bookingDetails.contactEmail) {
      toast.error('Please enter contact email');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateBookingDetails()) {
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false);
    
    // Show success message with booking details
    toast.success(`🎉 Payment successful! Booking ID: ${paymentId.slice(-6).toUpperCase()}`);
    
    // Create a mock booking entry
    const newBooking = {
      id: paymentId,
      destination: destination,
      itinerary: itinerary.title,
      travelers: bookingDetails.travelers,
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      amount: calculateTotalWithTravelers(),
      status: 'confirmed',
      paymentId: paymentId
    };
    
    // Store booking in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    existingBookings.unshift(newBooking);
    localStorage.setItem('user_bookings', JSON.stringify(existingBookings));
    
    // Navigate to bookings page with success message
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  const calculateTotalWithTravelers = () => {
    return totalAmount * bookingDetails.travelers;
  };

  const calculateDuration = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate) return 0;
    const start = new Date(bookingDetails.startDate);
    const end = new Date(bookingDetails.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/trips')}
            className="mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Trip Planning
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Your {destination} Trip</h1>
            <p className="text-gray-600 mt-1">{itinerary.title} - {itinerary.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Overview */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MapPinIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900">{destination}</h3>
                  <p className="text-sm text-blue-700">{itinerary.style}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CalendarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900">{itinerary.days.length} Days</h3>
                  <p className="text-sm text-green-700">{itinerary.accommodationType}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-purple-900">{formatPrice(totalAmount, selectedCurrency)}</h3>
                  <p className="text-sm text-purple-700">per person</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">What's Included:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {itinerary.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Booking Details Form */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Trip Start Date"
                    value={bookingDetails.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    required
                    helperText="When do you want to start your trip?"
                  />
                  <DatePicker
                    label="Trip End Date"
                    value={bookingDetails.endDate}
                    onChange={(date) => handleInputChange('endDate', date)}
                    minDate={bookingDetails.startDate}
                    excludeSameDay={true}
                    required
                    helperText="When does your trip end?"
                  />
                </div>

                <div>
                  <Input
                    label="Number of Travelers"
                    type="number"
                    min="1"
                    max="20"
                    value={bookingDetails.travelers}
                    onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
                    required
                    helperText="How many people will be traveling?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Email"
                    type="email"
                    value={bookingDetails.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="your@email.com"
                    required
                    helperText="For booking confirmations"
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={bookingDetails.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    helperText="For urgent updates"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingDetails.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any dietary restrictions, accessibility needs, or special occasions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-vertical"
                  />
                </div>
              </div>
            </Card>

            {/* Itinerary Preview */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Itinerary Preview</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {itinerary.days.map((day: any, dayIndex: number) => (
                  <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Day {day.day}: {day.title}
                    </h3>
                    <div className="space-y-2">
                      {day.activities.slice(0, 2).map((activity: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.name}</p>
                            <p className="text-gray-600">{activity.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-orange-600">
                              {formatPrice(activity.cost, selectedCurrency)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {day.activities.length > 2 && (
                        <p className="text-sm text-gray-500 ml-15">
                          +{day.activities.length - 2} more activities
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{destination}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{itinerary.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {calculateDuration() > 0 ? `${calculateDuration()} days` : `${itinerary.days.length} days`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-medium">{bookingDetails.travelers} person{bookingDetails.travelers !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-medium">{formatPrice(totalAmount, selectedCurrency)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">{formatPrice(calculateTotalWithTravelers(), selectedCurrency)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  For {bookingDetails.travelers} traveler{bookingDetails.travelers !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full"
                  size="lg"
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secure payment • 100% refundable within 24 hours
                  </p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">What's Included:</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{itinerary.accommodationType}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{itinerary.transportMode}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>All planned activities</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>{itinerary.uniqueFeature}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>24/7 travel support</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Complete Your Payment"
          size="lg"
        >
          <StripePayment
            amount={calculateTotalWithTravelers()}
            description={`${itinerary.title} trip to ${destination} for ${bookingDetails.travelers} traveler${bookingDetails.travelers !== 1 ? 's' : ''}`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};