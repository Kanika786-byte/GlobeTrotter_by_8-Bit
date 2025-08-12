import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Trip } from '../types';
import { format } from 'date-fns';
import { useTrips } from '../hooks/useTrips';
import toast from 'react-hot-toast';

export const TripDetailPage: React.FC = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { deleteTrip } = useTrips();
  const trip = location.state?.trip as Trip;

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trip not found</h3>
          <Button onClick={() => navigate('/trips')}>Back to Trips</Button>
        </div>
      </div>
    );
  }

  const handleEditTrip = () => {
    toast.success('Edit trip feature coming soon!');
  };

  const handleDeleteTrip = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(trip.id);
        toast.success('Trip deleted successfully');
        navigate('/trips');
      } catch (error) {
        toast.error('Failed to delete trip');
      }
    }
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/trips')}
              className="mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Trips
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
              <p className="text-gray-600 mt-1">{trip.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(trip.status)}`}>
              {trip.status}
            </span>
            <Button variant="outline" onClick={handleEditTrip}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDeleteTrip}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Details */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{format(new Date(trip.startDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{format(new Date(trip.endDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Travelers</p>
                      <p className="font-medium">{trip.travelerCount} person{trip.travelerCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium">${trip.totalBudget.toLocaleString()} {trip.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trip Stops */}
            {trip.stops && trip.stops.length > 0 && (
              <Card className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Stops</h2>
                <div className="space-y-4">
                  {trip.stops.map((stop, index) => (
                    <div key={stop.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{stop.destination.name}</h3>
                          <p className="text-sm text-gray-600">{stop.destination.city}, {stop.destination.country}</p>
                          {stop.notes && <p className="text-sm text-gray-700 mt-1">{stop.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Stop {stop.sequenceOrder}</p>
                          {stop.budget && <p className="font-medium">${stop.budget.toLocaleString()}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Privacy:</span>
                  <span className="font-medium capitalize">{trip.privacyLevel}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{format(new Date(trip.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <Button className="w-full">
                  Book Services
                </Button>
                <Button variant="outline" className="w-full">
                  Share Trip
                </Button>
                <Button variant="outline" className="w-full">
                  Export Itinerary
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};