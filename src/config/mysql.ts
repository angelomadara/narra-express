import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

// MySQL TypeORM configuration
export const mysqlConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'narra-express',
  entities: ["src/models/*.ts"],
  synchronize: process.env.NODE_ENV === 'development', // Only in development!
  logging: process.env.NODE_ENV === 'development' ? ['error','schema'] : false,
  extra: {
    connectionLimit: 10,
  }
};

// Create MySQL DataSource instance
export const MySQLDataSource = new DataSource(mysqlConfig);

// MySQL connection function
export const connectMySQL = async () => {
  try {
    await MySQLDataSource.initialize();
    console.log('✅ TypeORM MySQL Database connected successfully');
    return MySQLDataSource;
  } catch (error) {
    console.error('❌ MySQL Database connection failed:', error);
    throw error;
  }
};