import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { MySQLDataSource, connectMySQL } from './mysql';
import { MongoDataSource, connectMongoDB } from './mongodb';

dotenv.config();

// Database type from environment
const DB_TYPE = process.env.DB_TYPE || 'mysql';

// Export the appropriate DataSource based on DB_TYPE
export const AppDataSource: DataSource = DB_TYPE === 'mongodb' ? MongoDataSource : MySQLDataSource;

// Universal connection function that switches based on DB_TYPE
export const connectDB = async (): Promise<DataSource> => {
  try {
    let dataSource: DataSource;
    
    if (DB_TYPE === 'mongodb') {
      dataSource = await connectMongoDB();
    } else if (DB_TYPE === 'mysql') {
      dataSource = await connectMySQL();
    } else {
      throw new Error(`Unsupported database type: ${DB_TYPE}. Supported types: mysql, mongodb`);
    }
    
    return dataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Export individual configurations and connections for direct access if needed
export { MySQLDataSource, connectMySQL } from './mysql';
export { MongoDataSource, connectMongoDB } from './mongodb';