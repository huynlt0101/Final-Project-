import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  refresh,
  me,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';

const router = Router();

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must include uppercase, lowercase, number, and special character')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
router.get('/google', (req, res) => {
  res.json({
    success: true,
    message: 'Google OAuth integration pending',
    data: { provider: 'google' }
  });
});
router.get('/google/callback', (req, res) => {
  res.json({
    success: true,
    message: 'Google callback placeholder',
    data: { callback: '/api/auth/google/callback' }
  });
});

export default router;
