import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

// TypeORM configuration
export const databaseConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'earthquake_db',
  entities: ["src/models/*.ts"],
  synchronize: process.env.NODE_ENV === 'development', // Only in development!
  // logging: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development' ? ['error','schema'] : false,
  extra: {
    connectionLimit: 10,
  }
};

// Create DataSource instance
export const AppDataSource = new DataSource(databaseConfig);

// Connection function
export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ TypeORM MySQL Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};