import express from 'express';
import { loginUser,registerUser,adminLogin,getAllUsers,toggleUserStatus } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/list',adminAuth,getAllUsers)
userRouter.post('/toggle-status',adminAuth,toggleUserStatus)

export default userRouter;
