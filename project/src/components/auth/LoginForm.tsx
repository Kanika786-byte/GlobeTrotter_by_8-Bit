import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithEmail } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      
      // If we get here without error, it means the redirect was initiated
      // The actual auth completion will happen in the callback
      if (!result) {
        // For demo mode when Supabase is not configured
        const demoUser = {
          id: 'demo-user-google',
          email: 'demo@google.com',
          user_metadata: {
            first_name: 'Demo',
            last_name: 'User',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          },
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        localStorage.setItem('demo_auth', 'true');
        setUser(demoUser);
        toast.success('Successfully signed in with Google! (Demo Mode)');
        navigate('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Please set up Supabase')) {
          toast.error('Please set up Supabase to use Google authentication');
        } else {
          toast.error('Failed to sign in with Google');
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmail(formData.email, formData.password);
      
      if (user) {
        setUser(user);
        
        // Check if it's demo mode
        if (user.id === 'demo-user-id') {
          toast.success('Successfully signed in! (Demo Mode)');
        } else {
          toast.success('Successfully signed in!');
        }
        
        navigate('/plan-trip');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-gray-600">
          Welcome back to Globe Trotter
        </p>
      </div>

      <div className="space-y-6">
        {/* Google Sign In */}
        <Button 
          onClick={handleGoogleSignIn}
          loading={googleLoading} 
          variant="outline"
          className="w-full flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">⚠️ Supabase Setup Required First</h3>
              <div className="mt-1 text-sm text-blue-700">
                <div className="space-y-1">
                  <p className="text-red-700"><strong>URGENT:</strong> Click "⚠️ Setup Supabase First" button in the top right</p>
                  <p className="text-red-700"><strong>Then:</strong> Create Supabase project and update your .env file</p>
                  <p className="text-red-700"><strong>Finally:</strong> Follow Google OAuth setup guide</p>
                  <p className="text-green-700"><strong>Demo Mode:</strong> You can still sign in with any email/password for testing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 hover:text-orange-500 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
