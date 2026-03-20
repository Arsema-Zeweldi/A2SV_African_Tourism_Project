-- 001_init.down.sql

DROP TABLE IF EXISTS community_post_likes;
DROP TABLE IF EXISTS community_post_comments;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS package_chats;
DROP TABLE IF EXISTS package_reviews;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS itinerary_activities;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS auth_tokens;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS auth_token_type;
DROP TYPE IF EXISTS package_status_enum;
DROP TYPE IF EXISTS travel_vibe_interest_enum;
DROP TYPE IF EXISTS preferred_language_enum;
DROP TYPE IF EXISTS preferred_climate_enum;
DROP TYPE IF EXISTS budget_range_enum;
DROP TYPE IF EXISTS preferred_season_enum;

DROP EXTENSION IF EXISTS "pgcrypto";
