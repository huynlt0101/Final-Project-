import { successResponse } from '../utils/response.js';
import * as userService from '../services/user.service.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    return successResponse(res, 'Users retrieved successfully', { users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 'User retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 'User created successfully', { user }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, 'User updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return successResponse(res, 'User deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
