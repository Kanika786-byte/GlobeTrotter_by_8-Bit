import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  HeartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Destination } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface DestinationCardProps {
  destination: Destination;
  onSave?: (destinationId: string) => void;
  saved?: boolean;
  onAddToTrip?: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSave,
  saved = false,
  onAddToTrip,
}) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      return filled ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      );
    });
  };

  const handleBookServices = () => {
    navigate(`/book/${destination.id}`, { 
      state: { destination } 
    });
  };

  const handleSaveDestination = () => {
    if (onSave) {
      onSave(destination.id);
    }
    toast.success(saved ? 'Removed from saved' : 'Destination saved!');
  };
  return (
    <Card padding="none" hover className="overflow-hidden">
      <div className="relative">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-48 object-cover"
        />
        {destination.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        {onSave && (
          <button
            onClick={handleSaveDestination}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <HeartIcon className={`h-5 w-5 ${saved ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              <Link 
                to={`/destinations/${destination.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {destination.name}
              </Link>
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{destination.city}, {destination.country}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {destination.shortDescription}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(destination.avgRating)}
            <span className="text-sm text-gray-600 ml-1">
              {destination.avgRating.toFixed(1)} ({destination.reviewCount})
            </span>
          </div>
          {destination.avgTemperature && (
            <div className="text-sm text-gray-600">
              <span>{Math.round(destination.avgTemperature)}°C</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 font-medium">
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            <span>₹{destination.averagePrice}/day</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {destination.activityCategories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {destination.activityCategories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{destination.activityCategories.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <Link to={`/destinations/${destination.id}`} className="flex-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs"
            >
              View Details
            </Button>
          </Link>
          {onAddToTrip && (
            <Button 
              size="sm" 
              onClick={() => onAddToTrip(destination)}
              className="flex items-center space-x-1 text-xs"
            >
              <PlusIcon className="h-3 w-3" />
              <span>Add to Trip</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};