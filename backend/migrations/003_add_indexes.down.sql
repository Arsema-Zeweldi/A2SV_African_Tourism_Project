-- 003_add_indexes.down.sql
DROP INDEX IF EXISTS idx_users_first_name;
DROP INDEX IF EXISTS idx_users_last_name;
DROP INDEX IF EXISTS idx_destinations_name;
DROP INDEX IF EXISTS idx_destinations_slug;
DROP INDEX IF EXISTS idx_destinations_average_rating;
DROP INDEX IF EXISTS idx_safety_alerts_level;
DROP INDEX IF EXISTS idx_packages_price;
DROP INDEX IF EXISTS idx_packages_status;
DROP INDEX IF EXISTS idx_packages_rating_avg;
DROP INDEX IF EXISTS idx_packages_reviews_count;
DROP INDEX IF EXISTS idx_packages_view_count;
