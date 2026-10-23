import 'dotenv/config';
import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'test';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || 4000);

const useSsl = dbHost.includes('tidbcloud') || process.env.DB_SSL === 'true';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 20000,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
