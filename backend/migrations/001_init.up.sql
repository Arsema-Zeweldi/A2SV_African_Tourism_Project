-- 001_init.up.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE preferred_season_enum AS ENUM ('spring', 'summer', 'autumn', 'winter', 'any');
CREATE TYPE budget_range_enum AS ENUM ('low', 'medium', 'high', 'luxury');
CREATE TYPE preferred_climate_enum AS ENUM ('tropical', 'desert', 'coastal', 'highland', 'temperate', 'any');
CREATE TYPE preferred_language_enum AS ENUM ('english', 'french', 'arabic', 'portuguese', 'swahili', 'any');
CREATE TYPE travel_vibe_interest_enum AS ENUM ('adventure', 'relaxed', 'foodie', 'history', 'party', 'culture', 'wildlife', 'any');
CREATE TYPE package_status_enum AS ENUM ('private', 'public', 'archived');
CREATE TYPE auth_token_type AS ENUM ('email_verification', 'password_reset');

-- Users
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Auth tokens table (for email verification + password reset)
CREATE TABLE auth_tokens (
    token_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    token_type auth_token_type NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    preferred_season preferred_season_enum,
    budget_range budget_range_enum,
    preferred_activities JSONB,
    dietary_restrictions JSONB,
    preferred_climate preferred_climate_enum,
    preferred_language preferred_language_enum,
    travel_vibe_interest travel_vibe_interest_enum,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Geography
CREATE TABLE countries (
    country_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    iso_code CHAR(2) UNIQUE NOT NULL,
    capital VARCHAR(150),
    currency_code VARCHAR(10)
);

-- Itineraries
CREATE TABLE itineraries (
    itinerary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    days_count INTEGER DEFAULT 0,
    nights_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    total_cost_est DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_itinerary_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE itinerary_activities (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL,
    day_number INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_label VARCHAR(50),
    duration_label VARCHAR(50),
    cost_label VARCHAR(50),
    location VARCHAR(255),
    activity_type VARCHAR(50),
    image_url TEXT,
    ai_pick BOOLEAN DEFAULT FALSE,
    requirement TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    start_time TIME,
    end_time TIME,

    CONSTRAINT fk_activity_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id) ON DELETE CASCADE
);

-- Community packages
CREATE TABLE packages (
    package_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL,
    itinerary_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    status package_status_enum DEFAULT 'private',
    rating_avg DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    country VARCHAR(150),
    location VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'USD',
    image_url TEXT,
    duration_days INTEGER DEFAULT 0,
    category VARCHAR(100),
    group_size VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_package_creator FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_package_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(itinerary_id) ON DELETE RESTRICT
);

CREATE TABLE package_reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_package_review_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_package_review_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE package_chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_chat_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Community feed
CREATE TABLE community_posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(20),
    location VARCHAR(255),
    package_name VARCHAR(255),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    tags JSONB,
    status package_status_enum DEFAULT 'public',
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_community_post_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE community_post_comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_community_post_comment_post FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_comment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE community_post_likes (
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_community_post_like_post FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_like_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name ON users(last_name);
CREATE INDEX idx_packages_price ON packages(price);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_rating_avg ON packages(rating_avg);
CREATE INDEX idx_packages_reviews_count ON packages(reviews_count);
CREATE INDEX idx_packages_views_count ON packages(views_count);
CREATE INDEX idx_community_posts_status ON community_posts(status);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
