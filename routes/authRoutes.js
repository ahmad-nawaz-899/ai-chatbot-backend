// backend/routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser
} from '../controllers/authController.js';

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only routes (must pass JWT + admin key)
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

export default router;
