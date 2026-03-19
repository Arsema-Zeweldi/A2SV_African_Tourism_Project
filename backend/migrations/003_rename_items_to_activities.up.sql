-- 003_rename_items_to_activities.up.sql
ALTER TABLE itinerary_items RENAME TO itinerary_activities;
ALTER TABLE itinerary_activities RENAME COLUMN item_id TO activity_id;

-- If there are foreign keys, they might need renaming too for consistency, but Postgres handles the link.
-- Let's rename the constraint if possible to keep it clean.
ALTER TABLE itinerary_activities RENAME CONSTRAINT fk_item_itinerary TO fk_activity_itinerary;
