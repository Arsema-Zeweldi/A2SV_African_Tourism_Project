-- 003_rename_items_to_activities.down.sql
ALTER TABLE itinerary_activities RENAME CONSTRAINT fk_activity_itinerary TO fk_item_itinerary;
ALTER TABLE itinerary_activities RENAME COLUMN activity_id TO item_id;
ALTER TABLE itinerary_activities RENAME TO itinerary_items;
