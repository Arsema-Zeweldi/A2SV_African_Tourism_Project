-- ✅ ENUM Types
CREATE TYPE account_type_enum AS ENUM ('traveler', 'admin', 'business');
CREATE TYPE traveler_type_enum AS ENUM ('solo', 'couple', 'family', 'group');
CREATE TYPE preferred_season_enum AS ENUM ('spring', 'summer', 'autumn', 'winter', 'any');
CREATE TYPE budget_range_enum AS ENUM ('low', 'medium', 'high', 'luxury');
CREATE TYPE trip_duration_enum AS ENUM ('short', 'medium', 'long');
CREATE TYPE destination_type_enum AS ENUM ('city', 'beach', 'mountain', 'historical', 'nature', 'adventure');
CREATE TYPE best_season_enum AS ENUM ('spring', 'summer', 'autumn', 'winter', 'year_round');
CREATE TYPE insight_type_enum AS ENUM ('tip', 'warning', 'trend', 'highlight');
CREATE TYPE visa_type_enum AS ENUM ('none', 'e-visa', 'visa-on-arrival', 'required', 'free');
CREATE TYPE package_status_enum AS ENUM ('draft', 'published', 'archived');

-- ✅ Core Tables
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(50),
    country VARCHAR(100),
    profile_image_url TEXT,
    account_type account_type_enum NOT NULL DEFAULT 'traveler',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE TABLE user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    traveler_type traveler_type_enum,
    preferred_season preferred_season_enum,
    budget_range budget_range_enum,
    trip_duration trip_duration_enum,
    preferred_activities JSONB,
    dietary_restrictions JSONB,
    accessibility_needs JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE regions (
    region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE countries (
    country_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    iso_code CHAR(2) UNIQUE NOT NULL,
    capital VARCHAR(150),
    currency_code VARCHAR(10),
    flag_emoji VARCHAR(10),
    region_id UUID NOT NULL,
    CONSTRAINT fk_countries_region
        FOREIGN KEY (region_id) REFERENCES regions(region_id)
        ON DELETE RESTRICT
);

CREATE TABLE destinations (
    destination_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(255),
    country_id UUID NOT NULL,
    region_id UUID NOT NULL,
    city VARCHAR(150),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    destination_type destination_type_enum,
    hero_image_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    annual_visitors INTEGER,
    best_season best_season_enum,
    price_level INTEGER CHECK (price_level BETWEEN 1 AND 5),
    is_unesco_site BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_destinations_country
        FOREIGN KEY (country_id) REFERENCES countries(country_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_destinations_region
        FOREIGN KEY (region_id) REFERENCES regions(region_id)
        ON DELETE RESTRICT
);

-- ✅ Tagging & Favorites
CREATE TABLE tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0
);

CREATE TABLE destination_tags (
    destination_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (destination_id, tag_id),

    CONSTRAINT fk_destination_tags_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_destination_tags_tag
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        ON DELETE CASCADE
);

CREATE TABLE user_favorites (
    user_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, destination_id),

    CONSTRAINT fk_user_favorites_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_favorites_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE
);

-- ✅ Reviews & Recommendations
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    content TEXT,
    visit_date DATE,
    helpful_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE
);

CREATE TABLE user_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    match_score DECIMAL(5,4),
    reasoning TEXT,
    recommendation_factors JSONB,
    user_clicked BOOLEAN DEFAULT FALSE,
    user_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_recommendations_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recommendations_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE
);

-- ✅ AI + Analytics + Statistics
CREATE TABLE ai_insights (
    insight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type insight_type_enum NOT NULL,
    title VARCHAR(255),
    content TEXT,
    icon VARCHAR(100),
    destination_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ai_insights_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE
);

CREATE TABLE analytics_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type VARCHAR(100),
    event_category VARCHAR(100),
    event_data JSONB,
    destination_id UUID,
    session_id UUID,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_analytics_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_analytics_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE SET NULL
);

CREATE TABLE visitor_statistics (
    stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    total_visitors INTEGER,
    revenue_usd DECIMAL(12,2),
    average_stay_days DECIMAL(4,2),
    source_markets JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_statistics_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_destination_period UNIQUE (destination_id, year, quarter, month)
);

-- ✅ New Tables for Missing Components

-- Visa Requirements Table
CREATE TABLE visa_requirements (
    visa_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_country_id UUID NOT NULL,
    destination_country_id UUID NOT NULL,
    visa_type visa_type_enum NOT NULL,
    description TEXT,
    cost_usd DECIMAL(10,2),
    valid_days INTEGER,
    last_updated TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_visa_source_country FOREIGN KEY (source_country_id) REFERENCES countries(country_id) ON DELETE CASCADE,
    CONSTRAINT fk_visa_dest_country FOREIGN KEY (destination_country_id) REFERENCES countries(country_id) ON DELETE CASCADE,
    UNIQUE (source_country_id, destination_country_id)
);

-- Safety Alerts
CREATE TABLE safety_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL,
    destination_id UUID,
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,

    CONSTRAINT fk_safety_country FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE,
    CONSTRAINT fk_safety_destination FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL
);

-- Itineraries (AI Generated or Manual)
CREATE TABLE itineraries (
    itinerary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    total_cost_est DECIMAL(12,2),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_itinerary_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Itinerary Items (Activities/Days)
CREATE TABLE itinerary_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL,
    destination_id UUID,
    day_number INTEGER NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    activity_description TEXT,
    cost_est DECIMAL(10,2),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    start_time TIME,
    end_time TIME,

    CONSTRAINT fk_item_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_destination FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL
);

-- Community Packages (Purchasable/Public Itineraries)
CREATE TABLE packages (
    package_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    itinerary_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    status package_status_enum DEFAULT 'draft',
    rating_avg DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_package_creator FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_package_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id) ON DELETE RESTRICT
);

-- Package Reviews
CREATE TABLE package_reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_package_review_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_package_review_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Real-time Chats / Discussions for Packages
CREATE TABLE package_chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_chat_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ✅ Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_destinations_country ON destinations(country_id);
CREATE INDEX idx_destinations_region ON destinations(region_id);
CREATE INDEX idx_reviews_destination ON reviews(destination_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_destination ON analytics_events(destination_id);
CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_visa_countries ON visa_requirements(source_country_id, destination_country_id);
