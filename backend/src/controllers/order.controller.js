import { successResponse } from '../utils/response.js';
import * as orderService from '../services/order.service.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.listOrders(req.user);
    return successResponse(res, 'Orders retrieved successfully', { orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    return successResponse(res, 'Order retrieved successfully', { order });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user, req.body);
    return successResponse(res, 'Order created successfully', { order }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderPaymentStatus(
      req.params.id,
      req.body.payment_status,
      req.user
    );
    return successResponse(res, 'Order payment status updated successfully', { order });
  } catch (error) {
    next(error);
  }
};
