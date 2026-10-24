import { AppError } from './error.middleware.js';

/** Query keys allowed on GET /products (read-only filters). */
const ALLOWED_PRODUCT_LIST_QUERY = new Set(['category_id', 'search']);

/**
 * Block "create product" attempts via GET (?name=...&price=... or JSON body).
 */
export const blockProductCreateOnGet = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const queryKeys = Object.keys(req.query || {});
  const hasDisallowedQuery = queryKeys.some((key) => !ALLOWED_PRODUCT_LIST_QUERY.has(key));

  if (hasDisallowedQuery) {
    return next(
      new AppError(
        400,
        'Cannot create or update products with GET. Use POST /api/products (admin, JSON body) to create. GET only supports ?category_id= and ?search=.'
      )
    );
  }

  return next();
};
