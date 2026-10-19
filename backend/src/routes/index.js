import { Router } from 'express';
import { successResponse } from '../utils/response.js';
import * as healthController from '../controllers/healthController.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import profileRoutes from './profile.routes.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', healthController.getWelcome);
router.get('/health', healthController.getHealth);
router.use('/auth', authRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/profile', authenticate, profileRoutes);

router.get('/notifications', authenticate, (req, res) => {
  return successResponse(res, 'Notifications fetched successfully', { notifications: [] });
});

router.get('/ideas', authenticate, (req, res) => {
  return successResponse(res, 'Ideas fetched successfully', { ideas: [] });
});

router.post('/ideas', authenticate, (req, res) => {
  return successResponse(res, 'Idea created successfully', { idea: { ...req.body, user_id: req.user.id } }, 201);
});

router.put('/ideas/:id', authenticate, (req, res) => {
  return successResponse(res, 'Idea updated successfully', { id: req.params.id, ...req.body });
});

router.delete('/ideas/:id', authenticate, (req, res) => {
  return successResponse(res, 'Idea deleted successfully', { id: req.params.id });
});

router.get('/comments', authenticate, (req, res) => {
  return successResponse(res, 'Comments fetched successfully', { comments: [] });
});

router.post('/comments', authenticate, (req, res) => {
  return successResponse(res, 'Comment created successfully', { comment: { ...req.body, user_id: req.user.id } }, 201);
});

router.get('/votes', authenticate, (req, res) => {
  return successResponse(res, 'Votes fetched successfully', { votes: [] });
});

export default router;
