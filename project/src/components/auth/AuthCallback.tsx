import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for error in URL params first
      const error = searchParams.get('error');
      if (error) {
        console.error('Auth error from URL:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      // Check for token in URL params (for demo mode)
      const token = searchParams.get('token');
      if (token) {
        // Demo mode - create a demo user
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
        return;
      }

      if (!supabase) {
        // If no token and no supabase, redirect to login with setup message
        toast.error('Supabase not configured. Please set up your environment first.');
        navigate('/login');
        return;
      }

      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Google authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (data.user) {
          setUser(data.user);
          toast.success('Successfully signed in with Google!');
          navigate('/');
        } else {
          toast.error('No user session found. Please try signing in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please check your setup.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};