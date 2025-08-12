import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getCurrentUser, signOut as supabaseSignOut } from '../lib/supabase';

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Silently handle auth errors - they're expected when not authenticated
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [initialized, setUser, setLoading]);

  const signOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
      // Clear any demo mode data
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_auth');
      // Clear any cached auth data
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force sign out even if there's an error
      setUser(null);
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return { user, loading, signOut };
};