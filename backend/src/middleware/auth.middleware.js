import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { authConfig } from '../config/auth.js';
import { AppError } from './error.middleware.js';

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return req.cookies?.accessToken || req.cookies?.refreshToken || null;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    const payload = jwt.verify(token, authConfig.jwt.accessSecret);

    if (!payload || payload.type !== 'access') {
      throw new AppError(401, 'Authentication required');
    }

    const user = await User.findByPk(payload.sub, {
      include: [{ association: 'role' }]
    });

    if (!user || !user.is_active) {
      throw new AppError(401, 'Authentication required');
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name || user.role_name || 'user',
      is_active: user.is_active,
      department_id: user.department_id || null
    };

    next();
  } catch (error) {
    if (error?.name === 'TokenExpiredError' || error?.name === 'JsonWebTokenError') {
      return next(new AppError(401, 'Authentication required'));
    }

    return next(error);
  }
};
