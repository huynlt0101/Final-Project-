import { Router } from 'express';
import { body } from 'express-validator';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderPaymentStatus
} from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';

const router = Router();

const createOrderValidation = [
  body('payment_method').trim().notEmpty().withMessage('payment_method is required'),
  body('shipping_address').trim().notEmpty().withMessage('shipping_address is required'),
  body('payment_status').optional().isString().withMessage('payment_status must be a string'),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.product_id').isInt({ min: 1 }).withMessage('Each item needs a valid product_id'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item needs quantity >= 1')
];

const paymentStatusValidation = [
  body('payment_status')
    .trim()
    .notEmpty()
    .withMessage('payment_status is required')
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('payment_status must be pending, paid, failed, or refunded')
];

router.use(authenticate);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List orders for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
 *       401:
 *         description: Authentication required
 */
router.get('/', getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 */
router.post('/', createOrderValidation, validateRequest, createOrder);

/**
 * @swagger
 * /orders/{id}/payment-status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order payment status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatusUpdate'
 *     responses:
 *       200:
 *         description: Payment status updated
 *       400:
 *         description: Validation error
 */
router.put('/:id/payment-status', paymentStatusValidation, validateRequest, updateOrderPaymentStatus);

export default router;
