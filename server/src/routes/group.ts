import express from 'express';
import {
  createGroup,
  getUserGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  getGroupStats,
} from '../controllers/group';
import { protect } from '../middleware/authMiddleware';
import { validateGroupCreation, validateGroupUpdate } from '../validations/groupValidations';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', validateGroupCreation, createGroup);
router.get('/', getUserGroups);
router.get('/:id', getGroupById);
router.put('/:id', validateGroupUpdate, updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
router.get('/:id/stats', getGroupStats);

export { router as groupRoutes };
