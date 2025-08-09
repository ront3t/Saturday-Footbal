import { Request, Response } from 'express';
import { User } from '../models/user';
import { Game } from '../models/game';
import { Meetup } from '../models/meetup';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { profile } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { profile },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  // Get games where user participated
  const games = await Game.find({
    'events.player': userId,
  }).populate('meetup');

  // Calculate statistics
  let totalGoals = 0;
  let totalAssists = 0;
  let totalYellowCards = 0;
  let totalRedCards = 0;
  let gamesPlayed = games.length;

  games.forEach(game => {
    game.events.forEach(event => {
      if (event.player.toString() === userId) {
        switch (event.type) {
          case 'goal':
            totalGoals++;
            break;
          case 'assist':
            totalAssists++;
            break;
          case 'yellow_card':
            totalYellowCards++;
            break;
          case 'red_card':
            totalRedCards++;
            break;
        }
      }
    });
  });

  // Get meetups attended
  const meetupsAttended = await Meetup.countDocuments({
    $or: [
      { 'participants.confirmed': userId },
      { 'participants.guests.user': userId, 'participants.guests.approved': true }
    ],
    status: 'completed'
  });

  const stats = {
    gamesPlayed,
    meetupsAttended,
    totalGoals,
    totalAssists,
    totalYellowCards,
    totalRedCards,
    averageGoalsPerGame: gamesPlayed > 0 ? (totalGoals / gamesPlayed).toFixed(2) : 0,
    averageAssistsPerGame: gamesPlayed > 0 ? (totalAssists / gamesPlayed).toFixed(2) : 0,
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
