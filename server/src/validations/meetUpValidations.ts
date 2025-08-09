 import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const meetupCreationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters'),
  group: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid group ID'),
  dateTime: z.string().refine(date => {
    const meetupDate = new Date(date);
    const now = new Date();
    return meetupDate > now;
  }, 'Meetup date must be in the future'),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
  location: z.object({
    name: z.string().min(1, 'Location name is required').max(100, 'Location name too long'),
    address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
    coordinates: z.object({
      lat: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
      lng: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
    }),
  }),
  minParticipants: z.number().min(2, 'Minimum participants must be at least 2').max(50, 'Too many minimum participants'),
  maxParticipants: z.number().min(2, 'Maximum participants must be at least 2').max(100, 'Too many maximum participants'),
  costPerPerson: z.number().min(0, 'Cost cannot be negative').max(1000, 'Cost too high').optional(),
}).refine(data => data.maxParticipants >= data.minParticipants, {
  message: 'Maximum participants must be greater than or equal to minimum participants',
  path: ['maxParticipants'],
});

const meetupUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters').optional(),
  dateTime: z.string().refine(date => {
    const meetupDate = new Date(date);
    const now = new Date();
    return meetupDate > now;
  }, 'Meetup date must be in the future').optional(),
  duration: z.number().min(30, 'Duration must be at least 30 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
  location: z.object({
    name: z.string().min(1, 'Location name is required').max(100, 'Location name too long'),
    address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
    coordinates: z.object({
      lat: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
      lng: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
    }),
  }).optional(),
  minParticipants: z.number().min(2, 'Minimum participants must be at least 2').max(50, 'Too many minimum participants').optional(),
  maxParticipants: z.number().min(2, 'Maximum participants must be at least 2').max(100, 'Too many maximum participants').optional(),
  costPerPerson: z.number().min(0, 'Cost cannot be negative').max(1000, 'Cost too high').optional(),
  status: z.enum(['draft', 'published', 'full', 'completed', 'cancelled']).optional(),
}).refine(data => {
  if (data.maxParticipants && data.minParticipants) {
    return data.maxParticipants >= data.minParticipants;
  }
  return true;
}, {
  message: 'Maximum participants must be greater than or equal to minimum participants',
  path: ['maxParticipants'],
});

const guestRegistrationSchema = z.object({
  guestId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

const guestApprovalSchema = z.object({
  approved: z.boolean(),
});

export const validateMeetupCreation = (req: Request, res: Response, next: NextFunction) => {
  try {
    meetupCreationSchema.parse(req.body);
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

export const validateMeetupUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    meetupUpdateSchema.parse(req.body);
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

export const validateGuestRegistration = (req: Request, res: Response, next: NextFunction) => {
  try {
    guestRegistrationSchema.parse(req.body);
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

export const validateGuestApproval = (req: Request, res: Response, next: NextFunction) => {
  try {
    guestApprovalSchema.parse(req.body);
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
