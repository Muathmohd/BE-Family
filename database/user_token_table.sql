-- User token table (updated to match new schema)
CREATE TABLE IF NOT EXISTS user_token (
  user_token_id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT(11) UNSIGNED NOT NULL,
  token VARCHAR(64) NOT NULL,
  is_revoked TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (user_token_id),
  UNIQUE KEY uq_user_token_token (token),
  KEY fk_user_token_user (user_id),
  CONSTRAINT fk_user_token_user
    FOREIGN KEY (user_id) REFERENCES `user` (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add is_verified column to user table if not exists
ALTER TABLE `user` 
  MODIFY COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0;
