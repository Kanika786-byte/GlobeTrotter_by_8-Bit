import React, { useState } from 'react';
import { 
  UserIcon,
  CameraIcon,
  PencilIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { useCurrencyStore } from '../store/currencyStore';
import { formatPrice } from '../utils/currency';
import toast from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  location: string;
  travelStyle: string;
  interests: string[];
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { trips } = useTrips();
  const { selectedCurrency } = useCurrencyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.user_metadata?.first_name || 'John',
    lastName: user?.user_metadata?.last_name || 'Doe',
    email: user?.email || 'john.doe@example.com',
    bio: 'Passionate traveler exploring the world one destination at a time.',
    location: 'Mumbai, India',
    travelStyle: 'Adventure Seeker',
    interests: ['Adventure', 'Culture', 'Food', 'Photography', 'Nature']
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const availableInterests = [
    'Adventure', 'Culture', 'Food', 'Photography', 'Nature', 'History',
    'Art', 'Music', 'Sports', 'Shopping', 'Nightlife', 'Wellness',
    'Architecture', 'Wildlife', 'Beach', 'Mountains', 'Cities', 'Villages'
  ];

  const travelStyles = [
    'Budget Explorer', 'Luxury Traveler', 'Adventure Seeker', 'Cultural Enthusiast',
    'Solo Wanderer', 'Family Explorer', 'Business Traveler', 'Backpacker'
  ];

  // Calculate user stats
  const totalTrips = trips.length;
  const completedTrips = trips.filter(trip => trip.status === 'completed').length;
  const totalBudget = trips.reduce((sum, trip) => sum + trip.totalBudget, 0);
  const avgTripDuration = trips.length > 0 
    ? Math.round(trips.reduce((sum, trip) => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0) / trips.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and travel preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                >
                  {isEditing ? (
                    <>
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                        <Input
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                      <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Input
                        label="Location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-gray-600 mb-2">{profileData.email}</p>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{profileData.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">About Me</h4>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    placeholder="Tell us about your travel experiences and interests..."
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
                )}
              </div>

              {/* Travel Style */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Travel Style</h4>
                {isEditing ? (
                  <select
                    value={profileData.travelStyle}
                    onChange={(e) => setProfileData(prev => ({ ...prev, travelStyle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                  >
                    {travelStyles.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {profileData.travelStyle}
                  </span>
                )}
              </div>

              {/* Interests */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Travel Interests</h4>
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Select your travel interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableInterests.map((interest) => {
                        const isSelected = profileData.interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </Card>

            {/* Travel History */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Trips</h2>
              {trips.length > 0 ? (
                <div className="space-y-4">
                  {trips.slice(0, 3).map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{trip.title}</h3>
                        <p className="text-sm text-gray-600">{trip.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{trip.travelerCount} traveler{trip.travelerCount !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                            trip.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(trip.totalBudget, selectedCurrency)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {trips.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View All Trips
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No trips yet. Start planning your first adventure!</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/trips'}>
                    Plan Your First Trip
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Travel Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Trips</p>
                      <p className="font-semibold text-gray-900">{totalTrips}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="font-semibold text-gray-900">{completedTrips}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="font-semibold text-gray-900">{formatPrice(totalBudget, selectedCurrency)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <CalendarIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Trip Length</p>
                      <p className="font-semibold text-gray-900">{avgTripDuration} days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <StarIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gold-50 border border-yellow-200 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🏆</span>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Explorer</p>
                    <p className="text-xs text-yellow-700">Visited 5+ destinations</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✈️</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Frequent Flyer</p>
                    <p className="text-xs text-blue-700">Booked 10+ flights</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Budget Master</p>
                    <p className="text-xs text-green-700">Saved 20% on trips</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Plan New Trip
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View My Bookings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title="Edit Profile"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              />
              <Input
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />

            <Input
              label="Location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
              <select
                value={profileData.travelStyle}
                onChange={(e) => setProfileData(prev => ({ ...prev, travelStyle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
              >
                {travelStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <Textarea
                label="Bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                placeholder="Tell us about your travel experiences and interests..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = profileData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};