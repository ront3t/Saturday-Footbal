import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profile: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid date'),
    location: z.string().min(1, 'Location is required'),
    preferredPositions: z.array(z.string()).min(1, 'At least one position is required'),
    skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      throw new AppError(`Validation error: ${errorMessages.join(', ')}`, 400);
    }
    next(error);
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      throw new AppError(`Validation error: ${errorMessages.join(', ')}`, 400);
    }
    next(error);
  }
};