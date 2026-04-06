-- Content table for storing various content like about_family
CREATE TABLE IF NOT EXISTS `content` (
  `content_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content_code` VARCHAR(100) NOT NULL,
  `content_text` TEXT NOT NULL,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`content_id`),
  UNIQUE KEY `uq_content_code` (`content_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample content data
INSERT INTO `content` (`content_code`, `content_text`, `is_deleted`) VALUES
('about_family', 'Welcome to our family! This is the about family content that will be displayed in the mobile application.', 0)
ON DUPLICATE KEY UPDATE content_text = VALUES(content_text);

-- Add platform-specific settings for template and tree URLs
INSERT INTO `settings` (`key`, `value`) VALUES
('TEMPLATE_URL', 'https://example.com/template'),
('TEMPLATE_URL_IOS', 'https://example.com/template/ios'),
('TEMPLATE_URL_ANDROID', 'https://example.com/template/android'),
('TEMPLATE_URL_WEB', 'https://example.com/template/web'),
('TREE_URL', 'https://example.com/family-tree'),
('TREE_URL_IOS', 'https://example.com/family-tree/ios'),
('TREE_URL_ANDROID', 'https://example.com/family-tree/android'),
('TREE_URL_WEB', 'https://example.com/family-tree/web')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
