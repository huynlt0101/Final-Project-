import * as healthService from '../services/healthService.js';
import { successResponse } from '../utils/response.js';

// Handles GET /api
export const getWelcome = (req, res) => {
  const result = healthService.getWelcomeMessage();
  return successResponse(res, result.message);
};

// Handles GET /api/health
export const getHealth = (req, res) => {
  const result = healthService.getHealthStatus();
  return successResponse(res, result.message, result.data);
};
