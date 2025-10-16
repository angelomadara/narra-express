const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  try {
    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345678',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    // console.log({
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   port: process.env.DB_PORT,
    // })

    console.log('Connected to MySQL server');
    console.log(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)

    // terminate the connection if database name is not provided
    if (!process.env.DB_NAME) {
      console.error('❌ DB_NAME is not set in environment variables');
      process.exit(1);
    }

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database ${process.env.DB_NAME} created`);
    
    await connection.end();
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();