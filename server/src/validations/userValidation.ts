import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const profileUpdateSchema = z.object({
  profile: z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
    phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format').optional().or(z.literal('')),
    profileImage: z.object({
      type: z.enum(['avatar', 'upload']),
      value: z.string().min(1, 'Profile image value is required'),
    }).optional(),
    dateOfBirth: z.string().refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 100;
    }, 'Age must be between 16 and 100').optional(),
    location: z.string().min(1, 'Location is required').max(100, 'Location too long').optional(),
    preferredPositions: z.array(z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any']))
      .min(1, 'At least one position is required').optional(),
    skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const updateEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required to change email'),
});

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    profileUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new AppError(`Validation error: ${errorMessages.map(e => e.message).join(', ')}`, 400);
    }
    next(error);
  }
};

export const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    changePasswordSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new AppError(`Validation error: ${errorMessages.map(e => e.message).join(', ')}`, 400);
    }
    next(error);
  }
};

export const validateEmailUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateEmailSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new AppError(`Validation error: ${errorMessages.map(e => e.message).join(', ')}`, 400);
    }
    next(error);
  }
};
