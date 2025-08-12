import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  // Check if environment variables exist
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('❌ Supabase environment variables missing');
    return false;
  }
  
  // Check if they're not placeholder values
  if (supabaseUrl === 'your_supabase_project_url' || 
      supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('❌ Supabase environment variables are still placeholder values');
    return false;
  }
  
  // Check if URL looks like a real Supabase URL
  if (!supabaseUrl.includes('supabase.co') || !supabaseUrl.startsWith('https://')) {
    console.warn('❌ Invalid Supabase URL format:', supabaseUrl);
    return false;
  }
  
  // Check if anon key looks like a real JWT token
  if (!supabaseAnonKey.startsWith('eyJ')) {
    console.warn('❌ Invalid Supabase anon key format');
    return false;
  }
  
  console.log('✅ Supabase is properly configured');
  return true;
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth functions with proper error handling
export const signInWithGoogle = async () => {
  if (!supabase) {
    const errorMessage = getSupabaseSetupError();
    throw new Error(errorMessage);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });

  if (error) throw error;
  return data;
};

const getSupabaseSetupError = (): string => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase environment variables are missing. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.';
  }
  
  if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    return 'Supabase is not configured. Please:\n1. Click "Connect to Supabase" button in the top right\n2. Create a Supabase project\n3. Update your .env file with real credentials\n4. Restart your development server';
  }
  
  if (!supabaseUrl.includes('supabase.co')) {
    return 'Invalid Supabase URL. Your VITE_SUPABASE_URL should look like: https://your-project-id.supabase.co';
  }
  
  if (!supabaseAnonKey.startsWith('eyJ')) {
    return 'Invalid Supabase anon key. Your VITE_SUPABASE_ANON_KEY should start with "eyJ" and be a long JWT token.';
  }
  
  return 'Supabase connection failed. Please check your credentials and try again.';
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    // Demo mode - accept any email/password
    const demoUser = {
      id: 'demo-user-id',
      email,
      user_metadata: {
        first_name: email.split('@')[0],
        last_name: 'User',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      },
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage for demo
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    localStorage.setItem('demo_auth', 'true');
    
    return { user: demoUser };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
  if (!supabase) {
    // Demo mode - simulate successful signup
    const demoUser = {
      id: 'demo-user-id',
      email,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      },
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage for demo
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    localStorage.setItem('demo_auth', 'true');
    
    return { user: demoUser };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) {
      // Handle specific error cases without logging
      if (error.message.includes('User already registered') || error.message.includes('already_registered')) {
        const customError = new Error('user_already_exists');
        customError.name = 'AuthError';
        throw customError;
      }
      throw error;
    }
    return data;
  } catch (error) {
    // Re-throw without logging to console
    throw error;
  }
};

export const signOut = async () => {
  // Clear demo data
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_auth');
  
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  // Check demo mode first
  const demoAuth = localStorage.getItem('demo_auth');
  const demoUser = localStorage.getItem('demo_user');
  
  if (demoAuth && demoUser) {
    return JSON.parse(demoUser);
  }

  if (!supabase) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // Don't throw error for missing session - it's expected for unauthenticated users
      return null;
    }

    return user || null;
  } catch (error) {
    // Handle any other errors gracefully
    console.warn('Auth session check failed:', error);
    return null;
  }
};

// Database functions with fallbacks
export const getDestinations = async (filters?: any) => {
  if (!supabase) {
    // Return empty array in demo mode - destinations will be loaded from mock data
    return getMockDestinations(filters);
  }

  try {
    let query = supabase
      .from('destinations')
      .select('*')
      .eq('active', true);

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,country.ilike.%${filters.search}%`);
    }

    if (filters?.country) {
      query = query.ilike('country', `%${filters.country}%`);
    }

    if (filters?.continent) {
      query = query.eq('continent', filters.continent);
    }

    if (filters?.minRating) {
      query = query.gte('avg_rating', filters.minRating);
    }

    const { data, error } = await query.order('avg_rating', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    // Fallback to mock data when there's any database error
    console.warn('Database error, using mock data:', error);
    return getMockDestinations(filters);
  }
};

// Mock destinations for when database isn't set up
const getMockDestinations = (filters?: any) => {
  const mockDestinations = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      city: 'Paris',
      continent: 'Europe',
      description: 'The City of Light, famous for its art, fashion, and culture.',
      short_description: 'Romantic capital with iconic landmarks',
      avg_rating: 4.8,
      review_count: 1250,
      average_price: 150,
      image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
      active: true,
      featured: true
    },
    {
      id: '2',
      name: 'Tokyo',
      country: 'Japan',
      city: 'Tokyo',
      continent: 'Asia',
      description: 'A bustling metropolis blending traditional and modern culture.',
      short_description: 'Modern city with ancient traditions',
      avg_rating: 4.7,
      review_count: 980,
      average_price: 180,
      image_url: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
      active: true,
      featured: true
    },
    {
      id: '3',
      name: 'New York',
      country: 'United States',
      city: 'New York',
      continent: 'North America',
      description: 'The city that never sleeps, with world-class attractions.',
      short_description: 'Iconic skyline and endless entertainment',
      avg_rating: 4.6,
      review_count: 2100,
      average_price: 200,
      image_url: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg',
      active: true,
      featured: true
    },
    {
      id: '4',
      name: 'London',
      country: 'United Kingdom',
      city: 'London',
      continent: 'Europe',
      description: 'Historic city with royal palaces and modern attractions.',
      short_description: 'Royal heritage meets modern culture',
      avg_rating: 4.5,
      review_count: 1800,
      average_price: 170,
      image_url: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
      active: true,
      featured: true
    },
    {
      id: '5',
      name: 'Bali',
      country: 'Indonesia',
      city: 'Denpasar',
      continent: 'Asia',
      description: 'Tropical paradise with beautiful beaches and temples.',
      short_description: 'Island paradise with rich culture',
      avg_rating: 4.9,
      review_count: 750,
      average_price: 80,
      image_url: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
      active: true,
      featured: true
    },
    {
      id: '6',
      name: 'Rome',
      country: 'Italy',
      city: 'Rome',
      continent: 'Europe',
      description: 'Ancient city with incredible history and architecture.',
      short_description: 'Ancient history and iconic landmarks',
      avg_rating: 4.4,
      review_count: 1600,
      average_price: 120,
      image_url: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      active: true,
      featured: true
    }
  ];

  if (!filters) return mockDestinations;

  return mockDestinations.filter(dest => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = dest.name.toLowerCase().includes(searchLower) ||
                           dest.city.toLowerCase().includes(searchLower) ||
                           dest.country.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.country && !dest.country.toLowerCase().includes(filters.country.toLowerCase())) {
      return false;
    }

    if (filters.continent && dest.continent !== filters.continent) {
      return false;
    }

    if (filters.minRating && dest.avg_rating < filters.minRating) {
      return false;
    }

    return true;
  });
};