import React from 'react';
import { 
  SunIcon, 
  CloudIcon, 
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';

interface SeasonalWeatherProps {
  seasonalTemperatures?: {
    winter: number;
    summer: number;
    monsoon: number;
    postMonsoon: number;
    bestTime: string;
  };
  destinationName: string;
}

export const SeasonalWeather: React.FC<SeasonalWeatherProps> = ({
  seasonalTemperatures,
  destinationName
}) => {
  if (!seasonalTemperatures) {
    return null;
  }

  const seasons = [
    {
      name: 'Winter',
      temp: seasonalTemperatures.winter,
      icon: CloudIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      months: 'Dec - Feb'
    },
    {
      name: 'Summer',
      temp: seasonalTemperatures.summer,
      icon: SunIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      months: 'Mar - May'
    },
    {
      name: 'Monsoon',
      temp: seasonalTemperatures.monsoon,
      icon: CloudArrowDownIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      months: 'Jun - Sep'
    },
    {
      name: 'Post Monsoon',
      temp: seasonalTemperatures.postMonsoon,
      icon: CloudIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      months: 'Oct - Nov'
    }
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Seasonal Weather in {destinationName}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {seasons.map((season) => {
          const Icon = season.icon;
          return (
            <div
              key={season.name}
              className={`p-4 rounded-lg ${season.bgColor} text-center`}
            >
              <Icon className={`h-8 w-8 ${season.color} mx-auto mb-2`} />
              <h4 className="font-medium text-gray-900 text-sm">{season.name}</h4>
              <p className="text-xs text-gray-600 mb-1">{season.months}</p>
              <p className={`text-lg font-bold ${season.color}`}>
                {Math.round(season.temp)}°C
              </p>
            </div>
          );
        })}
      </div>

      {seasonalTemperatures.bestTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <SunIcon className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">Best Time to Visit</p>
              <p className="text-sm text-green-700">{seasonalTemperatures.bestTime}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};