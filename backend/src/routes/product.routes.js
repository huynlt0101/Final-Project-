import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { readOnlyGet, requireHttpMethod } from '../middleware/http.middleware.js';
import { blockProductCreateOnGet } from '../middleware/product.middleware.js';

const router = Router();

const productValidation = [
  body('category_id').isInt({ min: 1 }).withMessage('Valid category_id is required'),
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be >= 0'),
  body('image_url').optional({ nullable: true }).isString().withMessage('image_url must be a string'),
  body('technical_specs').optional({ nullable: true }).isObject().withMessage('technical_specs must be an object')
];

const productUpdateValidation = [
  body('category_id').optional().isInt({ min: 1 }).withMessage('Valid category_id is required'),
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be >= 0'),
  body('image_url').optional({ nullable: true }).isString().withMessage('image_url must be a string'),
  body('technical_specs').optional({ nullable: true }).isObject().withMessage('technical_specs must be an object')
];

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products
 *     responses:
 *       200:
 *         description: Products list
 */
router.get('/', requireHttpMethod('GET'), readOnlyGet, blockProductCreateOnGet, getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', requireHttpMethod('GET'), readOnlyGet, getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create product (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin only
 */
router.post(
  '/',
  requireHttpMethod('POST'),
  authenticate,
  authorize('admin'),
  productValidation,
  validateRequest,
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (admin)
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  requireHttpMethod('PUT'),
  authenticate,
  authorize('admin'),
  productUpdateValidation,
  validateRequest,
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (admin)
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  requireHttpMethod('DELETE'),
  authenticate,
  authorize('admin'),
  deleteProduct
);

export default router;
