-- Complete database schema matching your new structure

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `user_token`;
DROP TABLE IF EXISTS `user_otp`;
DROP TABLE IF EXISTS `news_media`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;


-- User table
CREATE TABLE `user` (
  `user_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Settings table
CREATE TABLE `settings` (
  `settings_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`settings_id`),
  UNIQUE KEY `uq_settings_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- News table
CREATE TABLE `news` (
  `news_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- News media table
CREATE TABLE `news_media` (
  `news_media_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `news_id` INT(11) UNSIGNED NOT NULL,
  `media_type` VARCHAR(50) NOT NULL,
  `media_url` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`news_media_id`),
  KEY `fk_news_media_news` (`news_id`),
  CONSTRAINT `fk_news_media_news`
    FOREIGN KEY (`news_id`) REFERENCES `news` (`news_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- User OTP table
CREATE TABLE `user_otp` (
  `user_otp_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `is_burned` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `burned_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_otp_id`),
  KEY `fk_user_otp_user` (`user_id`),
  CONSTRAINT `fk_user_otp_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- User token table
CREATE TABLE `user_token` (
  `user_token_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_token_id`),
  UNIQUE KEY `uq_user_token_token` (`token`),
  KEY `fk_user_token_user` (`user_id`),
  CONSTRAINT `fk_user_token_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Sample data for testing
INSERT INTO `user` (`username`, `mobile`, `is_verified`, `is_active`) VALUES
('Test User', '1234567890', 0, 1);

INSERT INTO `settings` (`key`, `value`) VALUES
('api_base_url', 'https://api.example.com'),
('sms_gateway_url', 'https://sms.example.com'),
('otp_expiry_minutes', '10'),
('max_otp_attempts', '3'),
('app_version', '1.0.0');
