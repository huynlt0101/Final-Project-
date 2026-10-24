import { Router } from 'express';
import { param } from 'express-validator';
import {
  listCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart
} from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { readOnlyGet, requireHttpMethod } from '../middleware/http.middleware.js';

const router = Router();

const cartIdValidation = [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')];

router.use(authenticate);

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: List carts (current user; admin sees all)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carts list
 */
router.get('/', requireHttpMethod('GET'), readOnlyGet, listCarts);

/**
 * @swagger
 * /cart:
 *   post:
 *     tags: [Cart]
 *     summary: Create cart for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cart created
 *       409:
 *         description: Cart already exists
 */
router.post('/', requireHttpMethod('POST'), createCart);

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     tags: [Cart]
 *     summary: Get cart by ID
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
 *         description: Cart found
 *       404:
 *         description: Cart not found
 */
router.get('/:id', requireHttpMethod('GET'), readOnlyGet, cartIdValidation, validateRequest, getCartById);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: View/refresh cart by ID (no editable cart fields)
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
 *         description: Cart returned
 *       404:
 *         description: Cart not found
 */
router.put('/:id', requireHttpMethod('PUT'), cartIdValidation, validateRequest, updateCart);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Delete cart and all its items
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
 *         description: Cart deleted
 *       404:
 *         description: Cart not found
 */
router.delete('/:id', requireHttpMethod('DELETE'), cartIdValidation, validateRequest, deleteCart);

export default router;
