import { successResponse } from '../utils/response.js';
import * as cartService from '../services/cart.service.js';

export const listCarts = async (req, res, next) => {
  try {
    const carts = await cartService.listCarts(req.user);
    return successResponse(res, 'Carts retrieved successfully', { carts });
  } catch (error) {
    next(error);
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const cart = await cartService.getCartById(req.params.id, req.user);
    return successResponse(res, 'Cart retrieved successfully', { cart });
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const cart = await cartService.createCart(req.user);
    return successResponse(res, 'Cart created successfully', { cart }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const cart = await cartService.updateCart(req.params.id, req.user);
    return successResponse(res, 'Cart retrieved successfully', { cart });
  } catch (error) {
    next(error);
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const result = await cartService.deleteCart(req.params.id, req.user);
    return successResponse(res, 'Cart deleted successfully', result);
  } catch (error) {
    next(error);
  }
};
