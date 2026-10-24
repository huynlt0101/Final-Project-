import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  listCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem
} from '../controllers/cartItem.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { readOnlyGet, requireHttpMethod } from '../middleware/http.middleware.js';

const router = Router();

const createItemValidation = [
  body('product_id').isInt({ min: 1 }).withMessage('product_id must be a positive integer'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be >= 1')
];

const updateItemValidation = [
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('quantity').isInt({ min: 1 }).withMessage('quantity must be >= 1')
];

const idValidation = [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')];

/**
 * @swagger
 * /cart/items:
 *   get:
 *     tags: [Cart Items]
 *     summary: List all items in the current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items list
 *       404:
 *         description: Cart not found
 */
router.get('/', requireHttpMethod('GET'), readOnlyGet, listCartItems);

/**
 * @swagger
 * /cart/items/{id}:
 *   get:
 *     tags: [Cart Items]
 *     summary: Get cart item by ID
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
 *         description: Cart item found
 *       404:
 *         description: Cart item not found
 */
router.get('/:id', requireHttpMethod('GET'), readOnlyGet, idValidation, validateRequest, getCartItemById);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart Items]
 *     summary: Create cart item (POST /cart first)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       201:
 *         description: Cart item created
 *       404:
 *         description: Cart not found
 *       409:
 *         description: Product already in cart or insufficient stock
 */
router.post('/', requireHttpMethod('POST'), createItemValidation, validateRequest, createCartItem);

/**
 * @swagger
 * /cart/items/{id}:
 *   put:
 *     tags: [Cart Items]
 *     summary: Update cart item quantity
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
 *             $ref: '#/components/schemas/CartItemUpdate'
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart item not found
 */
router.put('/:id', requireHttpMethod('PUT'), updateItemValidation, validateRequest, updateCartItem);

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     tags: [Cart Items]
 *     summary: Delete cart item
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
 *         description: Cart item deleted
 *       404:
 *         description: Cart item not found
 */
router.delete('/:id', requireHttpMethod('DELETE'), idValidation, validateRequest, deleteCartItem);

export default router;
