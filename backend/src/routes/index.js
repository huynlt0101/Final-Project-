import { Router } from 'express';
import { successResponse } from '../utils/response.js';
import * as healthController from '../controllers/healthController.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import profileRoutes from './profile.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: API welcome payload
 */
router.get('/', healthController.getWelcome);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', healthController.getHealth);

router.use('/auth', authRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/profile', authenticate, profileRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List notifications (placeholder)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications list
 */
router.get('/notifications', authenticate, (req, res) => {
  return successResponse(res, 'Notifications fetched successfully', { notifications: [] });
});

/**
 * @swagger
 * /ideas:
 *   get:
 *     tags: [Ideas]
 *     summary: List ideas (placeholder)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ideas list
 *   post:
 *     tags: [Ideas]
 *     summary: Create idea (placeholder)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Idea created
 */
router.get('/ideas', authenticate, (req, res) => {
  return successResponse(res, 'Ideas fetched successfully', { ideas: [] });
});

router.post('/ideas', authenticate, (req, res) => {
  return successResponse(res, 'Idea created successfully', { idea: { ...req.body, user_id: req.user.id } }, 201);
});

/**
 * @swagger
 * /ideas/{id}:
 *   put:
 *     tags: [Ideas]
 *     summary: Update idea (placeholder)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Idea updated
 *   delete:
 *     tags: [Ideas]
 *     summary: Delete idea (placeholder)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea deleted
 */
router.put('/ideas/:id', authenticate, (req, res) => {
  return successResponse(res, 'Idea updated successfully', { id: req.params.id, ...req.body });
});

router.delete('/ideas/:id', authenticate, (req, res) => {
  return successResponse(res, 'Idea deleted successfully', { id: req.params.id });
});

/**
 * @swagger
 * /comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments (placeholder)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comments list
 *   post:
 *     tags: [Comments]
 *     summary: Create comment (placeholder)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Comment created
 */
router.get('/comments', authenticate, (req, res) => {
  return successResponse(res, 'Comments fetched successfully', { comments: [] });
});

router.post('/comments', authenticate, (req, res) => {
  return successResponse(res, 'Comment created successfully', { comment: { ...req.body, user_id: req.user.id } }, 201);
});

/**
 * @swagger
 * /votes:
 *   get:
 *     tags: [Votes]
 *     summary: List votes (placeholder)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Votes list
 */
router.get('/votes', authenticate, (req, res) => {
  return successResponse(res, 'Votes fetched successfully', { votes: [] });
});

export default router;
