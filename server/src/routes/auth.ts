import express from 'express';
import {
  register,
  login,
  logout
} from '../controllers/auth';
import { validateRegistration, validateLogin } from '../validations/authValidations';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export { router as authRoutes };
