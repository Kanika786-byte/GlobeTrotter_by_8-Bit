/*
  # Create destinations table

  1. New Tables
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text, destination name)
      - `city` (text, city name)
      - `country` (text, country name)
      - `continent` (text, continent name)
      - `description` (text, full description)
      - `short_description` (text, brief description)
      - `latitude` (numeric, GPS latitude)
      - `longitude` (numeric, GPS longitude)
      - `avg_rating` (numeric, average rating)
      - `review_count` (integer, number of reviews)
      - `average_price` (numeric, average price per day)
      - `safety_index` (integer, safety rating 1-10)
      - `avg_temperature` (numeric, average temperature)
      - `image_url` (text, main image URL)
      - `featured` (boolean, featured destination)
      - `activity_categories` (text array, activity types)
      - `active` (boolean, active status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `destinations` table
    - Add policy for public read access
    - Add policy for authenticated users to manage destinations
*/

CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  continent text NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  latitude numeric,
  longitude numeric,
  avg_rating numeric DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  review_count integer DEFAULT 0,
  average_price numeric DEFAULT 0,
  safety_index integer DEFAULT 5 CHECK (safety_index >= 1 AND safety_index <= 10),
  avg_temperature numeric DEFAULT 20,
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  activity_categories text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Public read access for destinations
CREATE POLICY "Anyone can read active destinations"
  ON destinations
  FOR SELECT
  USING (active = true);

-- Authenticated users can manage destinations (for admin features)
CREATE POLICY "Authenticated users can manage destinations"
  ON destinations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_country ON destinations(country);
CREATE INDEX IF NOT EXISTS idx_destinations_continent ON destinations(continent);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_destinations_active ON destinations(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(avg_rating DESC);

-- Insert sample destinations
INSERT INTO destinations (name, city, country, continent, description, short_description, latitude, longitude, avg_rating, review_count, average_price, image_url, featured, activity_categories) VALUES
('Paris', 'Paris', 'France', 'Europe', 'The City of Light, famous for its art, fashion, and culture.', 'Romantic capital with iconic landmarks', 48.8566, 2.3522, 4.8, 1250, 150, 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', true, '{"culture", "art", "food", "romance"}'),
('Tokyo', 'Tokyo', 'Japan', 'Asia', 'A bustling metropolis blending traditional and modern culture.', 'Modern city with ancient traditions', 35.6762, 139.6503, 4.7, 980, 180, 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', true, '{"culture", "technology", "food", "temples"}'),
('New York', 'New York', 'United States', 'North America', 'The city that never sleeps, with world-class attractions.', 'Iconic skyline and endless entertainment', 40.7128, -74.0060, 4.6, 2100, 200, 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg', true, '{"urban", "entertainment", "culture", "shopping"}'),
('London', 'London', 'United Kingdom', 'Europe', 'Historic city with royal palaces and modern attractions.', 'Royal heritage meets modern culture', 51.5074, -0.1278, 4.5, 1800, 170, 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', true, '{"history", "culture", "museums", "royalty"}'),
('Bali', 'Denpasar', 'Indonesia', 'Asia', 'Tropical paradise with beautiful beaches and temples.', 'Island paradise with rich culture', -8.3405, 115.0920, 4.9, 750, 80, 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg', true, '{"beaches", "temples", "nature", "relaxation"}'),
('Rome', 'Rome', 'Italy', 'Europe', 'Ancient city with incredible history and architecture.', 'Eternal city of ancient wonders', 41.9028, 12.4964, 4.7, 1400, 140, 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg', true, '{"history", "architecture", "food", "art"}')
ON CONFLICT (id) DO NOTHING;