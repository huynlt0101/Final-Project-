import { successResponse } from '../utils/response.js';
import * as reviewService from '../services/review.service.js';

export const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await reviewService.listReviewsByProduct(req.params.productId);
    return successResponse(res, 'Reviews retrieved successfully', { reviews });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    return successResponse(res, 'Review retrieved successfully', { review });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user, req.body);
    return successResponse(res, 'Review created successfully', { review }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.user, req.body);
    return successResponse(res, 'Review updated successfully', { review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user);
    return successResponse(res, 'Review deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
