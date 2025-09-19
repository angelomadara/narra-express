-- Create database
CREATE DATABASE IF NOT EXISTS earthquake_db;
USE earthquake_db;

-- Create earthquakes table
-- CREATE TABLE IF NOT EXISTS earthquakes (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   magnitude DECIMAL(3,1) NOT NULL,
--   location VARCHAR(255) NOT NULL,
--   depth DECIMAL(6,2) NOT NULL,
--   date_time DATETIME NOT NULL,
--   latitude DECIMAL(10,8) NULL,
--   longitude DECIMAL(11,8) NULL,
--   source VARCHAR(100) NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
--   INDEX idx_magnitude (magnitude),
--   INDEX idx_location (location),
--   INDEX idx_date_time (date_time),
--   INDEX idx_coordinates (latitude, longitude)
-- );

-- -- Sample data (optional)
-- INSERT INTO earthquakes (magnitude, location, depth, date_time, latitude, longitude, source) VALUES
-- (5.2, 'Batangas', 10.5, '2024-01-15 14:30:00', 13.7565, 121.0583, 'PHIVOLCS'),
-- (4.8, 'Mindanao', 25.3, '2024-01-14 09:15:00', 7.1907, 125.4553, 'PHIVOLCS'),
-- (6.1, 'Luzon', 15.8, '2024-01-13 22:45:00', 16.0583, 120.3333, 'PHIVOLCS');