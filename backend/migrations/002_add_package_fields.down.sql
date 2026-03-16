-- 002_add_package_fields.down.sql
ALTER TABLE packages DROP COLUMN view_count;
ALTER TABLE packages DROP COLUMN country;
ALTER TABLE packages DROP COLUMN currency;
ALTER TABLE packages DROP COLUMN climate_pref;
ALTER TABLE packages DROP COLUMN is_multi_country;
ALTER TABLE packages DROP COLUMN is_streamer_verified;
ALTER TABLE packages DROP COLUMN streamer_name;
ALTER TABLE packages DROP COLUMN created_via_ai;

ALTER TABLE itinerary_items DROP COLUMN order_index;
ALTER TABLE itinerary_items DROP COLUMN activity_type;
