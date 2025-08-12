-- Globe Trotter Database Schema (PostgreSQL)
-- Complete production-ready database schema with indexes and constraints

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ===================================================================
-- CORE TABLES
-- ===================================================================

-- Users table with Firebase integration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image_url TEXT,
    
    -- Privacy and consent
    data_processing_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    analytics_consent BOOLEAN DEFAULT false,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Computed fields
    trips_count INTEGER DEFAULT 0,
    years_active DECIMAL(4,2) DEFAULT 0,
    avg_trip_budget DECIMAL(10,2),
    avg_trip_duration INTEGER
);

-- User profiles for extended information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    travel_preferences JSONB DEFAULT '{}',
    dietary_restrictions JSONB DEFAULT '[]',
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(3) DEFAULT 'USD',
    privacy_public BOOLEAN DEFAULT true,
    age_group VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Destinations with spatial data
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    google_place_id VARCHAR(255) UNIQUE,
    location GEOGRAPHY(POINT, 4326),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    continent VARCHAR(50),
    
    -- Content
    description TEXT,
    short_description VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    activity_categories JSONB DEFAULT '[]',
    
    -- Aggregated data
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    avg_review_sentiment DECIMAL(3,2) DEFAULT 0,
    average_price DECIMAL(10,2),
    cost_of_living_index INTEGER,
    safety_index INTEGER,
    avg_temperature DECIMAL(4,1),
    avg_rainfall DECIMAL(6,2),
    
    -- Status
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities available at destinations
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    description TEXT,
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    duration_hours INTEGER,
    difficulty_level VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    location GEOGRAPHY(POINT, 4326),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips created by users
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    traveler_count INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft',
    total_budget DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    privacy_level VARCHAR(20) DEFAULT 'private',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual stops within a trip
CREATE TABLE trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    arrival_date DATE,
    departure_date DATE,
    notes TEXT,
    budget DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_trip_sequence UNIQUE(trip_id, sequence_order)
);

-- Bookings for various services
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    booking_type VARCHAR(50) NOT NULL, -- flight, hotel, activity, etc.
    external_booking_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Financial
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_provider VARCHAR(50),
    payment_reference VARCHAR(255),
    
    -- Booking details
    booking_details JSONB DEFAULT '{}',
    booking_date DATE,
    service_date DATE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews for destinations and activities
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    
    -- Content
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Moderation and analysis
    moderation_status VARCHAR(50) DEFAULT 'pending',
    moderated_at TIMESTAMPTZ,
    moderation_reason TEXT,
    sentiment_score DECIMAL(3,2),
    confidence_score DECIMAL(3,2),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    helpful_votes INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media associated with reviews
CREATE TABLE review_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- image, video
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Moderation
    moderation_status VARCHAR(50) DEFAULT 'pending',
    vision_analysis JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML-generated recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    
    recommendation_type VARCHAR(50) NOT NULL,
    algorithm_version VARCHAR(20),
    confidence_score DECIMAL(3,2),
    explanation TEXT,
    features JSONB DEFAULT '{}',
    
    -- Tracking
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMPTZ,
    position_shown INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    
    -- Delivery
    delivery_method VARCHAR(50), -- push, email, in_app
    delivered_at TIMESTAMPTZ,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing index for destinations
CREATE TABLE pricing_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    
    -- Price data
    avg_price DECIMAL(10,2) NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Temporal data
    price_date DATE NOT NULL,
    season VARCHAR(20),
    day_of_week INTEGER,
    
    -- Source
    data_source VARCHAR(100),
    confidence INTEGER DEFAULT 100,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_destination_category_date UNIQUE(destination_id, category, subcategory, price_date)
);

-- ===================================================================
-- SUPPORT TABLES
-- ===================================================================

-- Consent tracking for GDPR compliance
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    granted BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- FCM tokens for push notifications
CREATE TABLE fcm_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_type VARCHAR(20),
    app_version VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip similarity clusters for ML
CREATE TABLE trip_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id INTEGER NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    distance_to_centroid DECIMAL(10,6),
    features JSONB DEFAULT '{}',
    algorithm_version VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Users indexes
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;

-- Destinations search indexes
CREATE INDEX idx_destinations_name_trgm ON destinations USING gin (name gin_trgm_ops);
CREATE INDEX idx_destinations_description_trgm ON destinations USING gin (description gin_trgm_ops);
CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_city ON destinations(city);
CREATE INDEX idx_destinations_active ON destinations(active) WHERE active = true;
CREATE INDEX idx_destinations_featured ON destinations(featured) WHERE featured = true;
CREATE INDEX idx_destinations_rating ON destinations(avg_rating DESC) WHERE active = true;

-- Geographic index for spatial queries
CREATE INDEX idx_destinations_location_gist ON destinations USING gist (location);

-- Composite indexes for common query patterns
CREATE INDEX idx_destinations_country_rating ON destinations(country, avg_rating DESC) WHERE active = true;
CREATE INDEX idx_destinations_continent_rating ON destinations(continent, avg_rating DESC) WHERE active = true;

-- Activities indexes
CREATE INDEX idx_activities_destination_id ON activities(destination_id);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_active ON activities(destination_id, active) WHERE active = true;

-- Trips indexes
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_user_created ON trips(user_id, created_at DESC);

-- Trip stops indexes
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_trip_stops_destination_id ON trip_stops(destination_id);
CREATE INDEX idx_trip_stops_sequence ON trip_stops(trip_id, sequence_order);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_bookings_type_status ON bookings(booking_type, status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Reviews indexes
CREATE INDEX idx_reviews_destination_id ON reviews(destination_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_moderation_status ON reviews(moderation_status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Composite index for approved reviews by destination
CREATE INDEX idx_reviews_dest_approved_rating ON reviews(destination_id, rating DESC) 
WHERE moderation_status = 'approved';

-- Review media indexes
CREATE INDEX idx_review_media_review_id ON review_media(review_id);
CREATE INDEX idx_review_media_moderation ON review_media(moderation_status);

-- Recommendations indexes
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_destination_id ON recommendations(destination_id);
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);
CREATE INDEX idx_recommendations_expires ON recommendations(expires_at) WHERE expires_at > NOW();
CREATE INDEX idx_recommendations_user_active ON recommendations(user_id, expires_at) WHERE expires_at > NOW();

-- Notifications indexes
CREATE INDEX idx_notifications_user_id_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Pricing index indexes
CREATE INDEX idx_pricing_destination_date ON pricing_index(destination_id, price_date DESC);
CREATE INDEX idx_pricing_category ON pricing_index(category, price_date DESC);
CREATE INDEX idx_pricing_dest_category ON pricing_index(destination_id, category, price_date DESC);

-- FCM tokens indexes
CREATE INDEX idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_active ON fcm_tokens(user_id, active) WHERE active = true;

-- Audit logs indexes (partitioned by month)
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);

-- Trip clusters indexes
CREATE INDEX idx_trip_clusters_trip_id ON trip_clusters(trip_id);
CREATE INDEX idx_trip_clusters_cluster ON trip_clusters(cluster_id);

-- ===================================================================
-- TRIGGERS AND FUNCTIONS
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update destination rating when review is added/updated
CREATE OR REPLACE FUNCTION update_destination_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        -- Recalculate rating after deletion
        UPDATE destinations SET 
            avg_rating = COALESCE((
                SELECT ROUND(AVG(rating)::numeric, 2)
                FROM reviews 
                WHERE destination_id = OLD.destination_id 
                AND moderation_status = 'approved'
            ), 0),
            review_count = (
                SELECT COUNT(*)
                FROM reviews 
                WHERE destination_id = OLD.destination_id 
                AND moderation_status = 'approved'
            )
        WHERE id = OLD.destination_id;
        
        RETURN OLD;
    ELSE
        -- Handle INSERT and UPDATE
        IF (NEW.moderation_status = 'approved') THEN
            UPDATE destinations SET 
                avg_rating = (
                    SELECT ROUND(AVG(rating)::numeric, 2)
                    FROM reviews 
                    WHERE destination_id = NEW.destination_id 
                    AND moderation_status = 'approved'
                ),
                review_count = (
                    SELECT COUNT(*)
                    FROM reviews 
                    WHERE destination_id = NEW.destination_id 
                    AND moderation_status = 'approved'
                )
            WHERE id = NEW.destination_id;
        END IF;
        
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Trigger for destination rating updates
CREATE TRIGGER update_destination_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_destination_rating();

-- ===================================================================
-- VIEWS FOR COMMON QUERIES
-- ===================================================================

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT t.id) as total_trips,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT r.id) as total_reviews,
    AVG(r.rating) as avg_review_rating,
    MAX(t.created_at) as last_trip_date,
    SUM(b.amount) as total_spent,
    u.created_at as member_since
FROM users u
LEFT JOIN trips t ON u.id = t.user_id
LEFT JOIN bookings b ON u.id = b.user_id AND b.payment_status = 'completed'
LEFT JOIN reviews r ON u.id = r.user_id AND r.moderation_status = 'approved'
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.first_name, u.last_name, u.created_at;

-- View for destination details with statistics
CREATE VIEW destination_details AS
SELECT 
    d.*,
    COUNT(DISTINCT r.id) as review_count,
    AVG(r.rating) as calculated_avg_rating,
    COUNT(DISTINCT t.id) as trip_count,
    AVG(pi.avg_price) as latest_avg_price,
    STRING_AGG(DISTINCT a.category, ', ') as available_activities
FROM destinations d
LEFT JOIN reviews r ON d.id = r.destination_id AND r.moderation_status = 'approved'
LEFT JOIN trip_stops ts ON d.id = ts.destination_id
LEFT JOIN trips t ON ts.trip_id = t.id
LEFT JOIN activities a ON d.id = a.destination_id AND a.active = true
LEFT JOIN pricing_index pi ON d.id = pi.destination_id 
    AND pi.price_date >= CURRENT_DATE - INTERVAL '30 days'
WHERE d.active = true
GROUP BY d.id;

-- ===================================================================
-- PARTITIONING FOR LARGE TABLES
-- ===================================================================

-- Partition audit_logs by month for better performance
CREATE TABLE audit_logs_template (LIKE audit_logs INCLUDING ALL);

-- Function to create monthly partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name text, start_date date)
RETURNS void AS $$
DECLARE
    partition_name text;
    end_date date;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + interval '1 month';
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF %I 
                   FOR VALUES FROM (%L) TO (%L)',
                   partition_name, table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- Create partitions for current and next few months
SELECT create_monthly_partition('audit_logs', date_trunc('month', CURRENT_DATE));
SELECT create_monthly_partition('audit_logs', date_trunc('month', CURRENT_DATE + interval '1 month'));
SELECT create_monthly_partition('audit_logs', date_trunc('month', CURRENT_DATE + interval '2 month'));

-- ===================================================================
-- SAMPLE QUERIES FOR TESTING
-- ===================================================================

-- Example: Find destinations near a point with good ratings
/*
SELECT d.name, d.city, d.country, d.avg_rating, d.review_count,
       ST_Distance(d.location, ST_GeogFromText('POINT(-74.006 40.7128)')) as distance_meters
FROM destinations d
WHERE d.active = true
AND ST_DWithin(d.location, ST_GeogFromText('POINT(-74.006 40.7128)'), 100000) -- 100km
AND d.avg_rating >= 4.0
AND d.review_count >= 5
ORDER BY d.avg_rating DESC, distance_meters ASC
LIMIT 20;
*/

-- Example: Get user's trip history with destinations
/*
SELECT t.title, t.start_date, t.end_date, t.status,
       STRING_AGG(d.name, ' -> ' ORDER BY ts.sequence_order) as route
FROM trips t
JOIN trip_stops ts ON t.id = ts.trip_id
JOIN destinations d ON ts.destination_id = d.id
WHERE t.user_id = 'user-uuid-here'
GROUP BY t.id, t.title, t.start_date, t.end_date, t.status
ORDER BY t.start_date DESC;
*/

-- Example: Find similar trips based on destinations visited
/*
WITH user_destinations AS (
    SELECT DISTINCT ts.destination_id
    FROM trips t
    JOIN trip_stops ts ON t.id = ts.trip_id
    WHERE t.user_id = 'user-uuid-here'
)
SELECT t.id, t.title, t.user_id, COUNT(*) as shared_destinations
FROM trips t
JOIN trip_stops ts ON t.id = ts.trip_id
WHERE ts.destination_id IN (SELECT destination_id FROM user_destinations)
AND t.user_id != 'user-uuid-here'
AND t.status = 'completed'
GROUP BY t.id, t.title, t.user_id
HAVING COUNT(*) >= 2
ORDER BY shared_destinations DESC
LIMIT 10;
*/