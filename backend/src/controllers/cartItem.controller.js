import { successResponse } from '../utils/response.js';
import * as cartItemService from '../services/cartItem.service.js';

export const listCartItems = async (req, res, next) => {
  try {
    const items = await cartItemService.listCartItems(req.user);
    return successResponse(res, 'Cart items retrieved successfully', { items });
  } catch (error) {
    next(error);
  }
};

export const getCartItemById = async (req, res, next) => {
  try {
    const item = await cartItemService.getCartItemById(req.params.id, req.user);
    return successResponse(res, 'Cart item retrieved successfully', { item });
  } catch (error) {
    next(error);
  }
};

export const createCartItem = async (req, res, next) => {
  try {
    const item = await cartItemService.createCartItem(req.user, req.body);
    return successResponse(res, 'Cart item created successfully', { item }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const item = await cartItemService.updateCartItem(req.user, req.params.id, req.body.quantity);
    return successResponse(res, 'Cart item updated successfully', { item });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const item = await cartItemService.deleteCartItem(req.user, req.params.id);
    return successResponse(res, 'Cart item deleted successfully', { item });
  } catch (error) {
    next(error);
  }
};
