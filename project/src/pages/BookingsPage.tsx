import React, { useState } from 'react';
import { 
  CalendarIcon, 
  CreditCardIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { Booking } from '../types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    tripId: 'trip1',
    bookingType: 'flight',
    status: 'confirmed',
    amount: 850,
    currency: 'USD',
    paymentStatus: 'completed',
    bookingDetails: {
      airline: 'Air France',
      flightNumber: 'AF123',
      departure: 'JFK',
      arrival: 'CDG',
      departureTime: '2025-06-15T14:30:00Z',
      arrivalTime: '2025-06-16T08:45:00Z',
      passengers: 2,
    },
    bookingDate: '2025-01-10',
    serviceDate: '2025-06-15',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    tripId: 'trip1',
    bookingType: 'hotel',
    status: 'confirmed',
    amount: 1200,
    currency: 'USD',
    paymentStatus: 'completed',
    bookingDetails: {
      hotelName: 'Hotel Le Marais',
      address: '123 Rue de Rivoli, Paris, France',
      checkIn: '2025-06-16',
      checkOut: '2025-06-20',
      roomType: 'Deluxe Double Room',
      guests: 2,
    },
    bookingDate: '2025-01-10',
    serviceDate: '2025-06-16',
    createdAt: '2025-01-10T10:15:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    bookingType: 'activity',
    status: 'pending',
    amount: 180,
    currency: 'USD',
    paymentStatus: 'pending',
    bookingDetails: {
      activityName: 'Louvre Museum Skip-the-Line Tour',
      provider: 'Paris Tours',
      date: '2025-06-17',
      time: '10:00',
      duration: '3 hours',
      participants: 2,
    },
    bookingDate: '2025-01-12',
    serviceDate: '2025-06-17',
    createdAt: '2025-01-12T16:20:00Z',
  },
];

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const navigate = useNavigate();

  // Load bookings from localStorage and merge with mock data
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    const allBookings = [...storedBookings.map((booking: any) => ({
      id: booking.id,
      userId: 'user1',
      tripId: booking.tripId,
      bookingType: booking.serviceType?.toLowerCase().includes('flight') ? 'flight' :
                   booking.serviceType?.toLowerCase().includes('hotel') ? 'hotel' :
                   booking.serviceType?.toLowerCase().includes('cab') ? 'transport' : 'activity',
      status: booking.status || 'confirmed',
      amount: booking.amount || 0,
      currency: 'USD',
      paymentStatus: 'completed',
      bookingDetails: {
        serviceName: booking.serviceType || booking.itinerary,
        destination: booking.destination,
        tier: booking.tier,
        travelers: booking.travelers,
        startDate: booking.startDate,
        endDate: booking.endDate
      },
      bookingDate: booking.bookingDate || new Date().toISOString().split('T')[0],
      serviceDate: booking.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: booking.bookingDate || new Date().toISOString()
    })), ...mockBookings];
    
    setBookings(allBookings);
  }, []);

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    const serviceDate = new Date(booking.serviceDate);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return serviceDate >= now;
    } else {
      return serviceDate < now;
    }
  });

  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'completed')
    .reduce((sum, b) => sum + b.amount, 0);

  const handleNewBooking = () => {
    navigate('/trips');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your travel reservations and bookings</p>
          </div>
          <Button onClick={handleNewBooking} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>New Booking</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings found.`
              }
            </p>
            <Button onClick={handleNewBooking}>Make Your First Booking</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
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

  const handleViewDetails = () => {
    navigate(`/bookings/${booking.id}`, { state: { booking } });
  };

  const handleModify = () => {
    toast.success('Modification feature coming soon!');
  };

  const renderBookingDetails = () => {
    switch (booking.bookingType) {
      case 'flight':
        return (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{booking.bookingDetails.airline} {booking.bookingDetails.flightNumber}</p>
            <p>{booking.bookingDetails.departure} → {booking.bookingDetails.arrival}</p>
            <p>{format(new Date(booking.bookingDetails.departureTime), 'MMM d, yyyy • h:mm a')}</p>
          </div>
        );
      case 'hotel':
        return (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{booking.bookingDetails.hotelName}</p>
            <p>{booking.bookingDetails.roomType}</p>
            <p>{format(new Date(booking.bookingDetails.checkIn), 'MMM d')} - {format(new Date(booking.bookingDetails.checkOut), 'MMM d, yyyy')}</p>
          </div>
        );
      case 'activity':
        return (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{booking.bookingDetails.activityName}</p>
            <p>{booking.bookingDetails.provider}</p>
            <p>{format(new Date(booking.bookingDetails.date), 'MMM d, yyyy')} • {booking.bookingDetails.time}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card hover className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-2xl">{getBookingTypeIcon(booking.bookingType)}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900 capitalize">
                {booking.bookingType} Booking
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            {renderBookingDetails()}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 mb-2">
            {getStatusIcon(booking.status)}
            <span className="text-sm text-gray-600">
              {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending Payment'}
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            ${booking.amount.toLocaleString()} {booking.currency}
          </p>
          <p className="text-sm text-gray-500">
            Booked {format(new Date(booking.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Service Date: {format(new Date(booking.serviceDate), 'MMM d, yyyy')}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleViewDetails} size="sm" variant="outline">
            View Details
          </Button>
          {booking.status === 'confirmed' && (
            <Button onClick={handleModify} size="sm" variant="outline">
              Modify
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};