/*
  # Create trip_stops table

  1. New Tables
    - `trip_stops`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, foreign key to trips)
      - `destination_id` (uuid, foreign key to destinations)
      - `sequence_order` (integer, order in trip)
      - `arrival_date` (date, arrival date)
      - `departure_date` (date, departure date)
      - `notes` (text, user notes)
      - `budget` (numeric, budget for this stop)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `trip_stops` table
    - Add policy for users to manage stops for their own trips
    - Add policy for public trip stops to be readable
*/

CREATE TABLE IF NOT EXISTS trip_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  destination_id uuid REFERENCES destinations(id) ON DELETE RESTRICT NOT NULL,
  sequence_order integer NOT NULL CHECK (sequence_order > 0),
  arrival_date date NOT NULL,
  departure_date date NOT NULL,
  notes text DEFAULT '',
  budget numeric DEFAULT 0 CHECK (budget >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;

-- Users can manage stops for their own trips
CREATE POLICY "Users can manage own trip stops"
  ON trip_stops
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Public trip stops are readable
CREATE POLICY "Public trip stops are readable"
  ON trip_stops
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.privacy_level = 'public'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_destination_id ON trip_stops(destination_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_sequence ON trip_stops(trip_id, sequence_order);

-- Add constraint to ensure departure_date is after arrival_date
ALTER TABLE trip_stops ADD CONSTRAINT check_stop_dates CHECK (departure_date >= arrival_date);

-- Add unique constraint for sequence order within a trip
ALTER TABLE trip_stops ADD CONSTRAINT unique_trip_sequence UNIQUE (trip_id, sequence_order);