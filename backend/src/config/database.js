import 'dotenv/config';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 4000,
        dialect: 'mysql',
        logging: false,

        dialectOptions: {
            ssl: {
                minVersion: 'TLSv1.2'
            }
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;