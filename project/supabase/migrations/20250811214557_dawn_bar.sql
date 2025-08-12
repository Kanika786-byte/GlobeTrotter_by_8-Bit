/*
  # Create trips table

  1. New Tables
    - `trips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, trip title)
      - `description` (text, trip description)
      - `start_date` (date, trip start date)
      - `end_date` (date, trip end date)
      - `traveler_count` (integer, number of travelers)
      - `status` (text, trip status)
      - `total_budget` (numeric, total budget)
      - `currency` (text, currency code)
      - `privacy_level` (text, privacy setting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `trips` table
    - Add policy for users to manage their own trips
    - Add policy for public trips to be readable by others
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  start_date date NOT NULL,
  end_date date NOT NULL,
  traveler_count integer DEFAULT 1 CHECK (traveler_count > 0),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'active', 'completed', 'cancelled')),
  total_budget numeric DEFAULT 0 CHECK (total_budget >= 0),
  currency text DEFAULT 'USD',
  privacy_level text DEFAULT 'private' CHECK (privacy_level IN ('private', 'friends', 'public')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can manage their own trips
CREATE POLICY "Users can manage own trips"
  ON trips
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public trips can be read by anyone
CREATE POLICY "Public trips are readable"
  ON trips
  FOR SELECT
  USING (privacy_level = 'public');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);

-- Add constraint to ensure end_date is after start_date
ALTER TABLE trips ADD CONSTRAINT check_trip_dates CHECK (end_date >= start_date);