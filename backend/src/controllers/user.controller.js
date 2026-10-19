import { successResponse } from '../utils/response.js';

export const getUsers = async (req, res) => {
  return successResponse(res, 'Users retrieved successfully', {
    users: []
  });
};

export const getUserById = async (req, res) => {
  return successResponse(res, 'User retrieved successfully', {
    user: {
      id: Number(req.params.id),
      username: 'example-user'
    }
  });
};
