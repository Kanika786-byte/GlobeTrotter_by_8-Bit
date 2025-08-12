import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Booking } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
          <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeIcon = (type: Booking['bookingType']) => {
    switch (type) {
      case 'flight':
        return '✈️';
      case 'hotel':
        return '🏨';
      case 'activity':
        return '🎯';
      case 'transport':
        return '🚗';
      case 'package':
        return '📦';
      default:
        return '📋';
    }
  };

  const handlePrintBooking = () => {
    window.print();
  };

  const handleShareBooking = () => {
    navigator.clipboard.writeText(`Booking Confirmation: ${booking.id}`);
    toast.success('Booking details copied to clipboard!');
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      toast.success('Booking cancellation request submitted');
      navigate('/bookings');
    }
  };

  const renderBookingDetails = () => {
    switch (booking.bookingType) {
      case 'flight':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-medium">{booking.bookingDetails.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Flight Number</p>
                <p className="font-medium">{booking.bookingDetails.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium">{booking.bookingDetails.departure}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.bookingDetails.departureTime), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-medium">{booking.bookingDetails.arrival}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.bookingDetails.arrivalTime), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Passengers</p>
                <p className="font-medium">{booking.bookingDetails.passengers}</p>
              </div>
            </div>
          </div>
        );
      case 'hotel':
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Hotel Name</p>
              <p className="font-medium">{booking.bookingDetails.hotelName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{booking.bookingDetails.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{format(new Date(booking.bookingDetails.checkIn), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{format(new Date(booking.bookingDetails.checkOut), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room Type</p>
                <p className="font-medium">{booking.bookingDetails.roomType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-medium">{booking.bookingDetails.guests}</p>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Activity</p>
              <p className="font-medium">{booking.bookingDetails.activityName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium">{booking.bookingDetails.provider}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{format(new Date(booking.bookingDetails.date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{booking.bookingDetails.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{booking.bookingDetails.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-medium">{booking.bookingDetails.participants}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/bookings')}
              className="mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Bookings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600 mt-1">Booking ID: {booking.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon(booking.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking Overview */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{getBookingTypeIcon(booking.bookingType)}</div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                    {booking.bookingType} Booking
                  </h2>
                  <p className="text-gray-600">
                    Service Date: {format(new Date(booking.serviceDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  ${booking.amount.toLocaleString()} {booking.currency}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending'}
                </p>
              </div>
            </div>

            {renderBookingDetails()}
          </Card>

          {/* Payment Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-medium capitalize">{booking.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Date</p>
                <p className="font-medium">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handlePrintBooking} variant="outline">
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print Booking
              </Button>
              <Button onClick={handleShareBooking} variant="outline">
                <ShareIcon className="h-4 w-4 mr-2" />
                Share Details
              </Button>
              {booking.status === 'confirmed' && (
                <Button onClick={handleCancelBooking} variant="outline">
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};