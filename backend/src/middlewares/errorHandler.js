import { errorResponse } from '../utils/response.js';
import config from '../config/index.js';

// Handles unknown API routes
export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 'API endpoint not found', 404);
};

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && config.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (config.nodeEnv !== 'production') {
    console.error(err);
  }

  return errorResponse(res, message, statusCode);
};
