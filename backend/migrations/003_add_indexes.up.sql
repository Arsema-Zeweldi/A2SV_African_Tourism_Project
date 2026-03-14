-- 003_add_indexes.up.sql
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name ON users(last_name);

CREATE INDEX idx_destinations_name ON destinations(name);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_average_rating ON destinations(average_rating);

CREATE INDEX idx_safety_alerts_level ON safety_alerts(level);

CREATE INDEX idx_packages_price ON packages(price);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_rating_avg ON packages(rating_avg);
CREATE INDEX idx_packages_reviews_count ON packages(reviews_count);
CREATE INDEX idx_packages_view_count ON packages(view_count);
