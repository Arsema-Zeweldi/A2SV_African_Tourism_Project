-- 004_add_status_to_posts.down.sql
DROP INDEX IF EXISTS idx_community_posts_status;
ALTER TABLE community_posts DROP COLUMN IF EXISTS status;
