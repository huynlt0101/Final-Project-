import config from '../config/index.js';

// Business logic for health and welcome endpoints
export const getWelcomeMessage = () => {
  return {
    success: true,
    message: 'Welcome to Backend API'
  };
};

export const getHealthStatus = () => {
  return {
    success: true,
    message: 'Backend is running',
    data: {
      server: 'Node.js',
      port: config.port,
      environment: config.nodeEnv
    }
  };
};
