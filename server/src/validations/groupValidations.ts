import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const groupCreationSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters'),
  privacy: z.enum(['public', 'private', 'invite-only']).default('public'),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  }),
  rules: z.string().max(1000, 'Rules cannot exceed 1000 characters').optional(),
});

const groupUpdateSchema = groupCreationSchema.partial();

export const validateGroupCreation = (req: Request, res: Response, next: NextFunction) => {
  try {
    groupCreationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      throw new AppError(`Validation error: ${errorMessages.join(', ')}`, 400);
    }
    next(error);
  }
};

export const validateGroupUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    groupUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      throw new AppError(`Validation error: ${errorMessages.join(', ')}`, 400);
    }
    next(error);
  }
};

// server/src/services/emailService.ts
