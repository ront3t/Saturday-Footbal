import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/user';
import { sendEmail } from '../services/emailService';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

const signToken = (id: string) => {
  const secret:Secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = '7d';

  return jwt.sign({ id }, secret, { expiresIn });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(String(user._id));
  
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined as any;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create new user
  const newUser = await User.create({
    email,
    password,
    profile,
    verificationToken,
  });

  // // Send verification email
  // const verificationURL = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  // await sendEmail({
  //   to: email,
  //   subject: 'Verify your email address',
  //   html: `
  //     <h1>Welcome to Soccer Meetup!</h1>
  //     <p>Please click the link below to verify your email address:</p>
  //     <a href="${verificationURL}">Verify Email</a>
  //   `,
  // });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email address before logging in', 401);
  }

  createSendToken(user, 200, res);
});

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  
  res.status(200).json({ status: 'success' });
};

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully',
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('No user found with that email address', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await user.save({ validateBeforeSave: false });

  // const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // await sendEmail({
  //   to: email,
  //   subject: 'Password Reset Request',
  //   html: `
  //     <h1>Password Reset</h1>
  //     <p>You have requested a password reset. Click the link below to reset your password:</p>
  //     <a href="${resetURL}">Reset Password</a>
  //     <p>This link will expire in 10 minutes.</p>
  //   `,
  // });

  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email',
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
