export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', flag: '🇲🇦' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', flag: '🇴🇲' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', flag: '🇯🇴' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', flag: '🇱🇧' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', flag: '🇲🇻' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu', flag: '🇧🇹' }
];

export const getDefaultCurrency = (): Currency => {
  // Try to detect user's location and return appropriate currency
  const userLocale = navigator.language || 'en-US';
  
  if (userLocale.includes('IN')) return currencies.find(c => c.code === 'INR')!;
  if (userLocale.includes('US')) return currencies.find(c => c.code === 'USD')!;
  if (userLocale.includes('GB')) return currencies.find(c => c.code === 'GBP')!;
  if (userLocale.includes('EU')) return currencies.find(c => c.code === 'EUR')!;
  
  return currencies.find(c => c.code === 'USD')!; // Default to USD
};

export const formatPrice = (amount: number, currency: Currency): string => {
  try {
    // Handle different currency formatting
    if (currency.code === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    } else if (currency.code === 'USD') {
      return `$${amount.toLocaleString('en-US')}`;
    } else if (currency.code === 'EUR') {
      return `€${amount.toLocaleString('de-DE')}`;
    } else if (currency.code === 'GBP') {
      return `£${amount.toLocaleString('en-GB')}`;
    } else if (currency.code === 'JPY') {
      return `¥${amount.toLocaleString('ja-JP')}`;
    } else {
      return `${currency.symbol}${amount.toLocaleString()}`;
    }
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
};

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
  // In a real app, you would call a currency conversion API
  // For demo purposes, using mock conversion rates
  const mockRates: Record<string, number> = {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'INR': 83.12,
    'JPY': 110.0,
    'AUD': 1.35,
    'CAD': 1.25,
    'SGD': 1.35,
    'AED': 3.67,
    'THB': 33.5
  };
  
  const fromRate = mockRates[fromCurrency] || 1;
  const toRate = mockRates[toCurrency] || 1;
  
  return (amount / fromRate) * toRate;
};