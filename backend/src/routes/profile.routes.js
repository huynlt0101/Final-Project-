import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';

const router = Router();

const updateProfileValidation = [
  body('username').optional().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email address'),

  body('address').optional().isString().withMessage('address must be a string'),
  body('phone_number').optional().isString().withMessage('phone_number must be a string')
];

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 *       401:
 *         description: Authentication required
 */
router.get('/', getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     tags: [Profile]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Validation error
 */
router.put('/', updateProfileValidation, validateRequest, updateProfile);

export default router;
