import { AppError } from './error.middleware.js';

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Authentication required'));
  }

  const userRole = String(req.user.role || '').toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    return next(new AppError(403, 'Access denied'));
  }

  next();
};
