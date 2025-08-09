import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        isVerified: boolean;
      };
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new AppError('You are not logged in! Please log in to get access.', 401);
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; iat: number };

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The user belonging to this token does no longer exist.', 401);
  }

  // 4) Check if user is verified
  if (!currentUser.isVerified) {
    throw new AppError('Please verify your email address to access this resource.', 401);
  }

  // Grant access to protected route
  req.user = {
    id: String(currentUser._id),
    email: currentUser.email,
    isVerified: currentUser.isVerified,
  };
  
  next();
});
