// App configuration loaded from environment variables
import 'dotenv/config';

const config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
