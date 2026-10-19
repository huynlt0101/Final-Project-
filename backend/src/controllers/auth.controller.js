import { successResponse } from '../utils/response.js';
import { registerUser, loginUser, logoutUser, refreshUserSession, getCurrentUser } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    const { user, accessToken, refreshToken } = result;

    result.setCookies(res, accessToken, refreshToken);

    return successResponse(res, 'Registration successful', { user, accessToken, refreshToken }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body, res);
    return successResponse(res, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken || null;
    const userId = req.user?.id || null;

    if (!userId && !refreshToken) {
      return successResponse(res, 'Logout successful');
    }

    await logoutUser(userId, refreshToken, res);
    return successResponse(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await refreshUserSession(token, res);

    return successResponse(res, 'Token refreshed successfully', {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return successResponse(res, 'Current user fetched', { user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    return successResponse(res, 'Password reset email sent');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    return successResponse(res, 'Password reset completed');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
