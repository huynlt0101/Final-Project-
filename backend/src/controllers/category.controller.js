import { successResponse } from '../utils/response.js';
import * as categoryService from '../services/category.service.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategories();
    return successResponse(res, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, 'Category retrieved successfully', { category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, 'Category created successfully', { category }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return successResponse(res, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 'Category deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
