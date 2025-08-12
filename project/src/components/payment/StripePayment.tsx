import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useCurrencyStore } from '../../store/currencyStore';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

interface StripePaymentProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, American Express, RuPay',
    available: true
  },
  {
    id: 'upi',
    type: 'upi',
    name: 'UPI',
    icon: '📱',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    available: true
  },
  {
    id: 'netbanking',
    type: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    description: 'All major banks supported',
    available: true
  },
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Digital Wallet',
    icon: '💰',
    description: 'Paytm, Amazon Pay, Mobikwik, Freecharge',
    available: true
  }
];

export const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  description,
  onSuccess,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const { selectedCurrency } = useCurrencyStore();

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
    'Bank of India', 'Central Bank of India', 'Indian Bank', 'UCO Bank'
  ];

  const wallets = [
    { name: 'Paytm', icon: '📱' },
    { name: 'Amazon Pay', icon: '🛒' },
    { name: 'Mobikwik', icon: '💳' },
    { name: 'Freecharge', icon: '⚡' },
    { name: 'PhonePe', icon: '📞' },
    { name: 'Google Pay', icon: '🔍' }
  ];

  const handlePayment = async () => {
    // Validate based on selected method
    if (selectedMethod.type === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast.error('Please fill in all card details');
        return;
      }
    } else if (selectedMethod.type === 'upi') {
      if (!upiId) {
        toast.error('Please enter your UPI ID');
        return;
      }
    } else if (selectedMethod.type === 'netbanking') {
      if (!selectedBank) {
        toast.error('Please select your bank');
        return;
      }
    } else if (selectedMethod.type === 'wallet') {
      if (!selectedWallet) {
        toast.error('Please select a wallet');
        return;
      }
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing with realistic delay and progress
      toast.loading('Processing payment...', { duration: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment success
      toast.dismiss();
      toast.success('Payment successful!');
      
      // Small delay before calling success callback
      setTimeout(() => {
        onSuccess(paymentId);
      }, 500);
      
      onSuccess(paymentId);
    } catch (error) {
      toast.dismiss();
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const renderPaymentForm = () => {
    switch (selectedMethod.type) {
      case 'card':
        return (
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({ 
                ...prev, 
                number: formatCardNumber(e.target.value) 
              }))}
              maxLength={19}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails(prev => ({ 
                  ...prev, 
                  expiry: formatExpiry(e.target.value) 
                }))}
                maxLength={5}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails(prev => ({ 
                  ...prev, 
                  cvv: e.target.value.replace(/[^0-9]/g, '') 
                }))}
                maxLength={4}
              />
            </div>
            
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
            />

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Your card details are encrypted and secure
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'upi':
        return (
          <div className="space-y-4">
            <Input
              label="UPI ID"
              placeholder="yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                You will receive a payment request on your UPI app
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <div key={app} className="p-3 border border-gray-200 rounded-lg text-center hover:border-orange-300 transition-colors">
                  <div className="text-sm font-medium text-gray-700">{app}</div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Bank
              </label>
              <select 
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
              >
                <option value="">Choose your bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <ExclamationTriangleIcon className="h-4 w-4 inline mr-2" />
                You will be redirected to your bank's secure login page
              </p>
            </div>
          </div>
        );
        
      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Digital Wallet
              </label>
              <div className="grid grid-cols-2 gap-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    type="button"
                    onClick={() => setSelectedWallet(wallet.name)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedWallet === wallet.name
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{wallet.icon}</div>
                      <div className="text-sm font-medium">{wallet.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (selectedMethod.type) {
      case 'card':
        return cardDetails.number && cardDetails.expiry && cardDetails.cvv && cardDetails.name;
      case 'upi':
        return upiId;
      case 'netbanking':
        return selectedBank;
      case 'wallet':
        return selectedWallet;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg mb-6 border border-orange-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatPrice(amount, selectedCurrency)}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                disabled={!method.available}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedMethod.id === method.id
                    ? 'border-orange-500 bg-orange-50'
                    : method.available 
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  {selectedMethod.id === method.id && method.available && (
                    <CheckIcon className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="mb-6">
          {renderPaymentForm()}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          <div className="flex items-start">
            <LockClosedIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium mb-1">
                Your payment is 100% secure
              </p>
              <p className="text-sm text-green-700">
                We use industry-standard SSL encryption and never store your payment details.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            loading={processing}
            disabled={!isFormValid()}
            className="flex-1"
          >
            {processing ? 'Processing...' : `Pay ${formatPrice(amount, selectedCurrency)}`}
          </Button>
        </div>

        {/* Payment Security Badges */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">Secured by</p>
          <div className="flex justify-center items-center space-x-6 opacity-70">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">VISA</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">MasterCard</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">RuPay</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">Stripe</div>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-4 mt-3 opacity-60">
            <span className="text-xs text-gray-500">256-bit SSL</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">PCI DSS Compliant</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Bank-level Security</span>
          </div>
        </div>
      </Card>
    </div>
  );
};