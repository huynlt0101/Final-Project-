import { successResponse } from '../utils/response.js';

export const getProfile = async (req, res) => {
  return successResponse(res, 'Profile retrieved successfully', {
    user: req.user
  });
};

export const updateProfile = async (req, res) => {
  return successResponse(res, 'Profile updated successfully', {
    user: {
      ...req.user,
      ...req.body
    }
  });
};
