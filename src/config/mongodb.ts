import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import log from '../services/log.service';

dotenv.config(); // sometimes the .env variables are not loaded

// MongoDB TypeORM configuration
export const mongodbConfig: DataSourceOptions = {
  type: "mongodb",
  url: process.env.MONGODB_URL,
  // Fallback to individual connection parameters if URL is not provided
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '27017'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'narra-mongo',
  entities: ["src/models/*.ts"],
  synchronize: false, // Disable synchronize to avoid index creation issues
  logging: process.env.NODE_ENV === 'development' ? ['error','schema'] : false,
};

// Create MongoDB DataSource instance
export const MongoDataSource = new DataSource(mongodbConfig);

// MongoDB connection function
export const connectMongoDB = async () => {
  try {
    await MongoDataSource.initialize();
    log.info('✅ TypeORM MongoDB Database connected successfully');
    return MongoDataSource;
  } catch (error) {
    log.error('❌ MongoDB Database connection failed:', error);
    throw error;
  }
};