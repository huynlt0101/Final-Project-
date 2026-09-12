import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', healthController.getWelcome);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server health status
 */
router.get('/health', healthController.getHealth);

export default router;
