import React, { useState } from 'react';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  destination: string;
  location: string;
  title: string;
  content: string;
  images: string[];
  rating: number;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
  tripDuration: string;
  budget: number;
  travelStyle: string;
}

interface TravelBuddy {
  id: string;
  name: string;
  avatar: string;
  location: string;
  age: number;
  travelStyle: string[];
  upcomingTrips: string[];
  completedTrips: number;
  rating: number;
  bio: string;
  interests: string[];
}

interface PostFormData {
  title: string;
  destination: string;
  location: string;
  duration: string;
  budget: number;
  travelStyle: string;
  content: string;
  rating: number;
}
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Goa',
    location: 'Baga Beach, Goa',
    title: 'Amazing 5-day Goa adventure on a budget!',
    content: 'Just returned from an incredible trip to Goa! Managed to explore beautiful beaches, try amazing seafood, and experience the vibrant nightlife all within ₹15,000. The Portuguese architecture in Old Goa is absolutely stunning. Highly recommend staying near Baga Beach for the best nightlife experience.',
    images: [
      'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 5,
    tags: ['Budget Travel', 'Beach', 'Nightlife', 'Food'],
    likes: 124,
    comments: 18,
    shares: 7,
    isLiked: false,
    createdAt: '2025-01-08T10:30:00Z',
    tripDuration: '5 days',
    budget: 15000,
    travelStyle: 'Budget Explorer'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Rajesh Kumar',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Dubai',
    location: 'Dubai Marina, UAE',
    title: 'Luxury Dubai experience - Worth every penny!',
    content: 'Splurged on a luxury Dubai trip and it was absolutely worth it! Stayed at Burj Al Arab, dined at world-class restaurants, and enjoyed VIP shopping experiences. The city\'s modern architecture is breathtaking. Pro tip: Book desert safari in advance!',
    images: [
      'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 5,
    tags: ['Luxury Travel', 'Architecture', 'Shopping', 'Desert Safari'],
    likes: 89,
    comments: 12,
    shares: 15,
    isLiked: true,
    createdAt: '2025-01-05T14:20:00Z',
    tripDuration: '7 days',
    budget: 85000,
    travelStyle: 'Luxury Traveler'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Anita Patel',
    userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
    destination: 'Kerala',
    location: 'Alleppey Backwaters, Kerala',
    title: 'Peaceful Kerala backwaters - Perfect family getaway',
    content: 'Kerala backwaters exceeded all expectations! The houseboat experience was magical, and the kids loved spotting birds and fish. Ayurvedic spa treatments were incredibly relaxing. The local cuisine is a must-try. Perfect destination for families seeking peace and nature.',
    images: [
      'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4,
    tags: ['Family Travel', 'Nature', 'Houseboat', 'Ayurveda'],
    likes: 156,
    comments: 23,
    shares: 11,
    isLiked: false,
    createdAt: '2025-01-03T09:15:00Z',
    tripDuration: '6 days',
    budget: 28000,
    travelStyle: 'Family Explorer'
  }
];

const mockTravelBuddies: TravelBuddy[] = [
  {
    id: '1',
    name: 'Arjun Singh',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Mumbai, India',
    age: 28,
    travelStyle: ['Adventure', 'Budget'],
    upcomingTrips: ['Ladakh Trek', 'Goa Beach'],
    completedTrips: 15,
    rating: 4.8,
    bio: 'Adventure enthusiast and budget traveler. Love trekking and exploring offbeat destinations.',
    interests: ['Trekking', 'Photography', 'Local Culture', 'Street Food']
  },
  {
    id: '2',
    name: 'Meera Reddy',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Bangalore, India',
    age: 32,
    travelStyle: ['Luxury', 'Cultural'],
    upcomingTrips: ['Rajasthan Heritage', 'Kerala Ayurveda'],
    completedTrips: 22,
    rating: 4.9,
    bio: 'Luxury traveler with a passion for heritage sites and wellness retreats.',
    interests: ['Heritage', 'Wellness', 'Fine Dining', 'Art']
  },
  {
    id: '3',
    name: 'Vikram Joshi',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Delhi, India',
    age: 26,
    travelStyle: ['Solo', 'Backpacking'],
    upcomingTrips: ['Southeast Asia', 'Himachal Pradesh'],
    completedTrips: 18,
    rating: 4.7,
    bio: 'Solo backpacker exploring the world one destination at a time. Always up for spontaneous adventures.',
    interests: ['Backpacking', 'Solo Travel', 'Local Experiences', 'Budget Tips']
  }
];

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'buddies' | 'groups'>('posts');
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'budget' | 'luxury' | 'family' | 'solo'>('all');
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PostFormData>({
    defaultValues: {
      rating: 0
    }
  });

  const watchedRating = watch('rating');

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleShare = (post: CommunityPost) => {
    navigator.clipboard.writeText(`Check out this amazing travel experience: ${post.title}`);
    toast.success('Post link copied to clipboard!');
  };

  const handleViewTripDetails = (post: CommunityPost) => {
    navigate(`/destinations/${post.destination.toLowerCase()}`, { 
      state: { 
        destination: {
          id: post.destination.toLowerCase(),
          name: post.destination,
          city: post.location.split(',')[0],
          country: post.location.split(',')[1]?.trim() || 'Unknown'
        }
      }
    });
  };

  const handleConnect = (buddy: TravelBuddy) => {
    toast.success(`Connection request sent to ${buddy.name}!`);
  };

  const handleViewProfile = (buddy: TravelBuddy) => {
    toast.success(`Viewing ${buddy.name}'s profile (feature coming soon)`);
  };

  const handleSearchBuddies = () => {
    toast.success('Searching for travel buddies with your preferences...');
  };

  const handleGetNotified = () => {
    toast.success('You\'ll be notified when Travel Groups feature launches!');
  };
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const onSubmitPost = async (data: PostFormData) => {
    setSubmitLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost: CommunityPost = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        destination: data.destination,
        location: data.location,
        title: data.title,
        content: data.content,
        images: [],
        rating: data.rating,
        tags: [data.travelStyle, 'Recent'],
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        tripDuration: data.duration,
        budget: data.budget,
        travelStyle: data.travelStyle
      };
      
      setPosts(prev => [newPost, ...prev]);
      toast.success('Travel story shared successfully!');
      setShowCreatePost(false);
      setSelectedRating(0);
      reset();
    } catch (error) {
      toast.error('Failed to share story. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || 
      post.travelStyle.toLowerCase().includes(selectedFilter) ||
      post.tags.some(tag => tag.toLowerCase().includes(selectedFilter));

    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <UserGroupIcon className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Travel Community</h1>
          </div>
          <p className="text-gray-600">Connect with fellow travelers, share experiences, and discover new adventures</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'posts', label: 'Travel Stories', icon: ChatBubbleLeftRightIcon },
              { key: 'buddies', label: 'Find Travel Buddies', icon: UserGroupIcon },
              { key: 'groups', label: 'Travel Groups', icon: UserGroupIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search travel stories, destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">All Stories</option>
                    <option value="budget">Budget Travel</option>
                    <option value="luxury">Luxury Travel</option>
                    <option value="family">Family Travel</option>
                    <option value="solo">Solo Travel</option>
                  </select>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Share Story
                  </Button>
                </div>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.userName}</h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{post.location}</span>
                            <span className="mx-2">•</span>
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(post.rating)}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      
                      {/* Trip Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {post.tripDuration}
                        </span>
                        <span className="flex items-center">
                          <span className="text-green-600 font-medium">₹{post.budget.toLocaleString()}</span>
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {post.travelStyle}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            #{tag.replace(' ', '')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post Images */}
                    {post.images.length > 0 && (
                      <div className="mb-4">
                        <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${post.destination} ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          {post.isLiked ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5" />
                          )}
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <ChatBubbleLeftRightIcon className="h-5 w-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                        >
                          <ShareIcon className="h-5 w-5" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                      
                      <Button size="sm" variant="outline" onClick={() => handleViewTripDetails(post)}>
                        View Trip Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Community Stats */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Travelers</span>
                    <span className="font-semibold">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stories Shared</span>
                    <span className="font-semibold">3,256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Covered</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Buddies Found</span>
                    <span className="font-semibold">1,423</span>
                  </div>
                </div>
              </Card>

              {/* Trending Destinations */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending This Week</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Goa', posts: 45, trend: '+12%' },
                    { name: 'Dubai', posts: 32, trend: '+8%' },
                    { name: 'Kerala', posts: 28, trend: '+15%' },
                    { name: 'Rajasthan', posts: 24, trend: '+5%' }
                  ].map((destination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{destination.name}</p>
                        <p className="text-sm text-gray-600">{destination.posts} posts</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">{destination.trend}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Tips */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Tips</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">💡 Budget Tip</p>
                    <p className="text-blue-700">Book flights 6-8 weeks in advance for best deals</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">🌟 Pro Tip</p>
                    <p className="text-green-700">Travel during shoulder season for fewer crowds</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">📱 Tech Tip</p>
                    <p className="text-purple-700">Download offline maps before traveling</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Travel Buddies Tab */}
        {activeTab === 'buddies' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockTravelBuddies.map((buddy) => (
                  <Card key={buddy.id} hover>
                    <div className="flex items-start space-x-4">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{buddy.name}</h3>
                          <div className="flex items-center">
                            {renderStars(Math.floor(buddy.rating))}
                            <span className="ml-1 text-sm text-gray-600">{buddy.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{buddy.location} • {buddy.age} years old</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{buddy.bio}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {buddy.travelStyle.map((style, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>{buddy.completedTrips} trips completed</span>
                          <span>{buddy.upcomingTrips.length} upcoming trips</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" onClick={() => handleConnect(buddy)}>
                            Connect
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleViewProfile(buddy)}>
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Your Perfect Travel Buddy</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <Input placeholder="Where do you want to go?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black">
                      <option>Any</option>
                      <option>Adventure</option>
                      <option>Budget</option>
                      <option>Luxury</option>
                      <option>Cultural</option>
                      <option>Solo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black">
                      <option>Any</option>
                      <option>18-25</option>
                      <option>26-35</option>
                      <option>36-45</option>
                      <option>45+</option>
                    </select>
                  </div>
                  <Button className="w-full" onClick={handleSearchBuddies}>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Search Buddies
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Travel Groups Tab */}
        {activeTab === 'groups' && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Groups Coming Soon!</h3>
            <p className="text-gray-600 mb-6">We're working on bringing you amazing travel groups to join.</p>
            <Button onClick={handleGetNotified}>
              Get Notified
            </Button>
          </div>
        )}

        {/* Create Post Modal */}
        <Modal
          isOpen={showCreatePost}
          onClose={() => {
            setShowCreatePost(false);
            setSelectedRating(0);
            reset();
          }}
          title="Share Your Travel Story"
        >
          <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Title</label>
              <Input
                {...register('title', { required: 'Title is required' })}
                placeholder="Amazing 5-day Goa adventure..."
                error={errors.title?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <Input
                  {...register('destination', { required: 'Destination is required' })}
                  placeholder="Goa"
                  error={errors.destination?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  {...register('location', { required: 'Location is required' })}
                  placeholder="Baga Beach, Goa"
                  error={errors.location?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <Input
                  {...register('duration', { required: 'Duration is required' })}
                  placeholder="5 days"
                  error={errors.duration?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                <Input
                  type="number"
                  {...register('budget', { required: 'Budget is required', min: 0 })}
                  placeholder="15000"
                  error={errors.budget?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
              <select
                {...register('travelStyle', { required: 'Travel style is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
              >
                <option value="">Select travel style</option>
                <option value="Budget Explorer">Budget Explorer</option>
                <option value="Luxury Traveler">Luxury Traveler</option>
                <option value="Family Explorer">Family Explorer</option>
                <option value="Solo Adventurer">Solo Adventurer</option>
                <option value="Cultural Enthusiast">Cultural Enthusiast</option>
              </select>
              {errors.travelStyle && (
                <p className="text-red-500 text-sm mt-1">{errors.travelStyle.message}</p>
              )}
            </div>

            <div>
              <Textarea
                label="Your Experience"
                {...register('content', { required: 'Please share your experience' })}
                rows={4}
                placeholder="Share your amazing travel experience..."
                error={errors.content?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate Your Experience</label>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingClick(i + 1)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        i < selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreatePost(false);
                  setSelectedRating(0);
                  reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitLoading}
                className="flex-1"
              >
                Share Story
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};