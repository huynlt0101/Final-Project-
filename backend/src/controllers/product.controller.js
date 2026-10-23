import { successResponse } from '../utils/response.js';
import * as productService from '../services/product.service.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.listProducts(req.query);
    return successResponse(res, 'Products retrieved successfully', { products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 'Product retrieved successfully', { product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
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
