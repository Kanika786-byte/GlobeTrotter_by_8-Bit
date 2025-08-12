import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency, getDefaultCurrency } from '../utils/currency';

interface CurrencyState {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: getDefaultCurrency(),
      setCurrency: (currency) => set({ selectedCurrency: currency }),
      convertAmount: (amount: number, fromCurrency = 'INR') => {
        const { selectedCurrency } = get();
        
        // Mock conversion rates (in production, use real API)
        const rates: Record<string, number> = {
          'USD': 83.12, // 1 USD = 83.12 INR
          'EUR': 89.45, // 1 EUR = 89.45 INR
          'GBP': 105.23, // 1 GBP = 105.23 INR
          'INR': 1, // Base currency
          'JPY': 0.56, // 1 JPY = 0.56 INR
          'AUD': 55.67,
          'CAD': 61.45,
          'SGD': 61.89,
          'AED': 22.63,
          'THB': 2.48,
          'MYR': 18.76,
          'CNY': 11.45
        };
        
        const fromRate = rates[fromCurrency] || 1;
        const toRate = rates[selectedCurrency.code] || 1;
        
        // Convert from base currency (INR) to selected currency
        return Math.round((amount / fromRate) * toRate);
      }
    }),
    {
      name: 'currency-storage',
    }
  )
);