const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345678'
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS earthquake_db');
    console.log('✅ Database created');

    // Switch to the database
    await connection.query('USE earthquake_db');
    console.log('✅ Using earthquake_db');

    // Create table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS earthquakes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        magnitude DECIMAL(3,1) NOT NULL,
        location VARCHAR(255) NOT NULL,
        depth DECIMAL(6,2) NOT NULL,
        date_time DATETIME NOT NULL,
        latitude DECIMAL(10,8) NULL,
        longitude DECIMAL(11,8) NULL,
        source VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_magnitude (magnitude),
        INDEX idx_location (location),
        INDEX idx_date_time (date_time),
        INDEX idx_coordinates (latitude, longitude)
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Table created');

    // Insert sample data
    const insertQuery = `
      INSERT INTO earthquakes (magnitude, location, depth, date_time, latitude, longitude, source) VALUES
      (5.2, 'Batangas', 10.5, '2024-01-15 14:30:00', 13.7565, 121.0583, 'PHIVOLCS'),
      (4.8, 'Mindanao', 25.3, '2024-01-14 09:15:00', 7.1907, 125.4553, 'PHIVOLCS'),
      (6.1, 'Luzon', 15.8, '2024-01-13 22:45:00', 16.0583, 120.3333, 'PHIVOLCS')
    `;
    
    await connection.query(insertQuery);
    console.log('✅ Sample data inserted');
    
    await connection.end();
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();