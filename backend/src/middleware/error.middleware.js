export class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const createHttpError = (statusCode, message, errors = []) => new AppError(statusCode, message, errors);
