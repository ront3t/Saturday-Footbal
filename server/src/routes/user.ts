import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  getUserStats,
} from '../controllers/user';
import { protect } from '../middleware/authMiddleware';
import { validateProfileUpdate } from '../validations/userValidation';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.get('/:id', getUserById);
router.get('/:id/stats', getUserStats);

export { router as userRoutes };

