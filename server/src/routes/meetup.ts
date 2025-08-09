import express from 'express';
import {
  createMeetup,
  getUserMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
  registerForMeetup,
  cancelRegistration,
  registerGuest,
  approveGuest,
} from '../controllers/meetup';
import { protect } from '../middleware/authMiddleware';
import { validateMeetupCreation, validateMeetupUpdate } from '../validations/meetUpValidations';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', validateMeetupCreation, createMeetup);
router.get('/', getUserMeetups);
router.get('/:id', getMeetupById);
router.put('/:id', validateMeetupUpdate, updateMeetup);
router.delete('/:id', deleteMeetup);
router.post('/:id/register', registerForMeetup);
router.delete('/:id/register', cancelRegistration);
router.post('/:id/guests', registerGuest);
router.put('/:id/guests/:userId', approveGuest);

export { router as meetupRoutes };
