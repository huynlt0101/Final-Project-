import { successResponse } from '../utils/response.js';
import { AppError } from '../middleware/error.middleware.js';
import * as productService from '../services/product.service.js';

/** GET — read only (query: ?category_id=&search=). Never creates products. */
export const getProducts = async (req, res, next) => {
  try {
    if (req.method !== 'GET') {
      throw new AppError(405, 'Use GET to list products or POST (admin) to create a product');
    }

    const products = await productService.listProducts(req.query);
    return successResponse(res, 'Products retrieved successfully', { products });
  } catch (error) {
    next(error);
  }
};

/** GET — read one product by id. Never creates products. */
export const getProductById = async (req, res, next) => {
  try {
    if (req.method !== 'GET') {
      throw new AppError(405, 'Use GET to view a product or PUT (admin) to update');
    }

    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 'Product retrieved successfully', { product });
  } catch (error) {
    next(error);
  }
};

/** POST (admin) — only way to create a product in the catalog. */
export const createProduct = async (req, res, next) => {
  try {
    if (req.method !== 'POST') {
      throw new AppError(405, 'Create products with POST /api/products (admin token required)');
    }

    const product = await productService.createProduct(req.body);
    return successResponse(res, 'Product created successfully', { product }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return successResponse(res, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return successResponse(res, 'Product deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
