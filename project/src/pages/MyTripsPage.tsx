import React, { useState } from 'react';
import { PlusIcon, MapIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { DatePicker } from '../components/ui/DatePicker';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Trip } from '../types';
import { useTrips } from '../hooks/useTrips';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface TripFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  totalBudget: number;
  privacyLevel: 'private' | 'friends' | 'public';
}

export const MyTripsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    travelerCount: 1,
    totalBudget: 0,
    privacyLevel: 'private'
  });
  const navigate = useNavigate();
  
  const { trips, loading, error, createTrip } = useTrips();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripFormData>();

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

  const onSubmit = async (data: TripFormData) => {
    setSubmitLoading(true);
    try {
      await createTrip({
        ...data,
        status: 'draft',
        currency: 'USD',
        stops: []
      });
      
      toast.success('Trip created successfully!');
      setIsCreateModalOpen(false);
      reset();
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        travelerCount: 1,
        totalBudget: 0,
        privacyLevel: 'private'
      });
    } catch (error) {
      toast.error('Failed to create trip');
      console.error('Error creating trip:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredTrips = {
    draft: trips.filter(trip => trip.status === 'draft'),
    planned: trips.filter(trip => trip.status === 'planned'),
    active: trips.filter(trip => trip.status === 'active'),
    completed: trips.filter(trip => trip.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading trips</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Plan, organize, and track your travel adventures</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Trip</span>
          </Button>
        </div>

        {/* Trip Sections */}
        <div className="space-y-8">
          {/* Draft Trips */}
          {filteredTrips.draft.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Draft Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.draft.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {/* Planned Trips */}
          {filteredTrips.planned.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Planned Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.planned.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {/* Active Trips */}
          {filteredTrips.active.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.active.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Trips */}
          {filteredTrips.completed.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.completed.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="text-center py-12">
            <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">
              Start planning your next adventure by creating your first trip.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Trip
            </Button>
          </div>
        )}

        {/* Create Trip Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Trip"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Trip Title"
              {...register('title', { required: 'Trip title is required' })}
              error={errors.title?.message}
              placeholder="e.g., European Adventure"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />

            <div>
              <Textarea
                label="Description"
                {...register('description')}
                rows={3}
                placeholder="Describe your trip..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                required
              />

              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                minDate={formData.startDate}
                excludeSameDay={true}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Number of Travelers"
                type="number"
                min="1"
                {...register('travelerCount', { 
                  required: 'Number of travelers is required',
                  min: { value: 1, message: 'At least 1 traveler required' }
                })}
                error={errors.travelerCount?.message}
                value={formData.travelerCount}
                onChange={(e) => setFormData(prev => ({ ...prev, travelerCount: parseInt(e.target.value) || 1 }))}
              />

              <Input
                label="Total Budget (USD)"
                type="number"
                min="0"
                {...register('totalBudget', { 
                  required: 'Budget is required',
                  min: { value: 0, message: 'Budget must be positive' }
                })}
                error={errors.totalBudget?.message}
                value={formData.totalBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privacy Level
              </label>
              <select
                {...register('privacyLevel')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                value={formData.privacyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, privacyLevel: e.target.value as any }))}
              >
                <option value="private">Private (Only me)</option>
                <option value="friends">Friends (Friends can see)</option>
                <option value="public">Public (Everyone can see)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitLoading}>
                Create Trip
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
  const navigate = useNavigate();

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

  const handleViewDetails = () => {
    navigate(`/my-trips/${trip.id}`, { state: { trip } });
  };

  return (
    <Card hover className="cursor-pointer" onClick={handleViewDetails}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{trip.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(trip.status)}`}>
          {trip.status}
        </span>
      </div>

      {trip.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>
      )}

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 mr-2" />
          <span>{trip.travelerCount} traveler{trip.travelerCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center">
          <span className="text-green-600 font-medium">
            ${trip.totalBudget.toLocaleString()} {trip.currency}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Created {format(new Date(trip.createdAt), 'MMM d, yyyy')}
          </span>
          <Button onClick={handleViewDetails} size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};