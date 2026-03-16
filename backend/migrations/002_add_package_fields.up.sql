-- 002_add_package_fields.up.sql
ALTER TABLE packages ADD COLUMN view_count INT DEFAULT 0;
ALTER TABLE packages ADD COLUMN country VARCHAR(150);
ALTER TABLE packages ADD COLUMN currency VARCHAR(10) DEFAULT 'USD';
ALTER TABLE packages ADD COLUMN climate_pref VARCHAR(100);
ALTER TABLE packages ADD COLUMN is_multi_country BOOLEAN DEFAULT FALSE;
ALTER TABLE packages ADD COLUMN is_streamer_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE packages ADD COLUMN streamer_name VARCHAR(150);
ALTER TABLE packages ADD COLUMN created_via_ai BOOLEAN DEFAULT FALSE;

ALTER TABLE itinerary_items ADD COLUMN order_index INT DEFAULT 0;
ALTER TABLE itinerary_items ADD COLUMN activity_type VARCHAR(50);
