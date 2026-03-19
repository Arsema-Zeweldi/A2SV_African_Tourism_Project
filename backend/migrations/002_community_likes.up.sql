-- 002_community_likes.up.sql
CREATE TABLE community_post_likes (
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_community_post_like_post FOREIGN KEY (post_id) REFERENCES community_posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_like_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
