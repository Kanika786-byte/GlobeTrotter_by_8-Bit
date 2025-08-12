import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { currencies, Currency } from '../../utils/currency';
import { useCurrencyStore } from '../../store/currencyStore';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency: Currency) => {
    setCurrency(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm hover:border-gray-400 transition-colors"
      >
        <span className="flex items-center">
          <span className="mr-2 text-lg">{selectedCurrency.flag}</span>
          <span className="block truncate font-medium text-black">
            {selectedCurrency.code}
          </span>
          <span className="ml-2 text-gray-500 hidden sm:block">
            {selectedCurrency.symbol}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
              autoFocus
            />
          </div>
          
          {/* Currency List */}
          <div className="max-h-60 overflow-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className="w-full text-left relative py-2 pl-3 pr-9 hover:bg-orange-50 cursor-pointer transition-colors text-black"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{currency.flag}</span>
                    <div className="flex-1">
                      <span className="block font-medium text-black">
                        {currency.code}
                      </span>
                      <span className="block text-sm text-black truncate">
                        {currency.name}
                      </span>
                    </div>
                    <span className="ml-2 text-black text-sm">
                      {currency.symbol}
                    </span>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <CheckIcon className="h-5 w-5 text-orange-600" />
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="py-4 px-3 text-center text-black text-sm">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};