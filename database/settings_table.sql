-- Settings table schema (matching existing structure)
-- Note: This table should already exist in your database
-- Use this only if you need to recreate it

CREATE TABLE IF NOT EXISTS settings (
  settings_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) DEFAULT NULL,
  `value` VARCHAR(255) DEFAULT NULL,
  INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample settings data (optional)
INSERT INTO settings (`key`, `value`) VALUES
('api_base_url', 'https://api.example.com'),
('sms_gateway_url', 'https://sms.example.com'),
('otp_expiry_minutes', '10'),
('max_otp_attempts', '3'),
('app_version', '1.0.0')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
