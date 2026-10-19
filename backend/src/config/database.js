import 'dotenv/config';
import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || process.env.DATABASE || 'test';
const dbUser = process.env.DB_USER || process.env.USERNAME || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.PASSWORD || '';
const dbHost = process.env.DB_HOST || process.env.HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || process.env.PORT || 4000);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: dbHost.includes('tidbcloud') || process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : undefined
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
