-- 004_add_status_to_posts.up.sql
ALTER TABLE community_posts ADD COLUMN status package_status_enum DEFAULT 'public';
CREATE INDEX idx_community_posts_status ON community_posts(status);
