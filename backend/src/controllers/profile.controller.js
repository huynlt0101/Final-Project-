import { successResponse } from '../utils/response.js';
import * as userService from '../services/user.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return successResponse(res, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user.id, {
  
      address: req.body.address,
      phone_number: req.body.phone_number,
      username: req.body.username,
      email: req.body.email
    });
    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};
