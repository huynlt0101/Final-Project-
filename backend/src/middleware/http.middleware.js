import { AppError } from './error.middleware.js';

const hasRequestBody = (req) => {
  if (!req.body || typeof req.body !== 'object') {
    return false;
  }

  return Object.keys(req.body).length > 0;
};

const hasPayloadOnRead = (req) => {
  const contentLength = Number(req.headers['content-length'] || 0);
  return contentLength > 0 || hasRequestBody(req);
};

/**
 * GET/HEAD are read-only: never create or update data.
 * Reject requests that include a body (common Postman mistake).
 */
export const rejectBodyOnReadMethods = (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && hasPayloadOnRead(req)) {
    return next(
      new AppError(
        400,
        'GET cannot create products. List: GET /api/products (no body). Create: POST /api/products (admin + JSON body).'
      )
    );
  }

  return next();
};

/** Use on GET route handlers for catalog endpoints (products, categories, cart lists). */
export const readOnlyGet = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  if (hasPayloadOnRead(req)) {
    return next(
      new AppError(
        400,
        'GET is read-only. Remove the Body tab in Postman or use POST to create data.'
      )
    );
  }

  return next();
};

/** Enforce HTTP verb on a route (e.g. POST-only create). */
export const requireHttpMethod = (...allowedMethods) => (req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return next(
      new AppError(
        405,
        `Method ${req.method} not allowed. Use ${allowedMethods.join(' or ')}.`
      )
    );
  }

  return next();
};
