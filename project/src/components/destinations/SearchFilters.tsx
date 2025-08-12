import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SearchFilters as SearchFiltersType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}) => {
  const continents = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'
  ];

  const categories = [
    'Adventure', 'Culture', 'Food', 'Nature', 'Nightlife', 'Relaxation', 
    'Shopping', 'Sports', 'History', 'Art'
  ];

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    handleFilterChange('categories', newCategories);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            onClick={onToggle}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          {Object.values(filters).some(v => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)) && (
            <Button variant="ghost" onClick={onClearFilters} size="sm">
              Clear all
            </Button>
          )}
        </div>

        {isOpen && (
          <div className="pb-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Continent Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Continent
                </label>
                <select
                  value={filters.continent || ''}
                  onChange={(e) => handleFilterChange('continent', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">All continents</option>
                  {continents.map((continent) => (
                    <option key={continent} value={continent}>
                      {continent}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">Any rating</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="4.5">4.5+ stars</option>
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price per Day
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 200"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={`${filters.sortBy || 'rating'}-${filters.sortOrder || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="rating-desc">Highest rated</option>
                  <option value="rating-asc">Lowest rated</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Activity Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = filters.categories?.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};