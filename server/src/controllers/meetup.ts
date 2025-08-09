import { Request, Response } from 'express';
import { Meetup } from '../models/meetup';
import { Group } from '../models/group';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createMeetup = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    description,
    group,
    dateTime,
    duration,
    location,
    minParticipants,
    maxParticipants,
    costPerPerson,
  } = req.body;

  // Check if user is a member of the group
  const groupDoc = await Group.findById(group);
  if (!groupDoc) {
    throw new AppError('Group not found', 404);
  }

  if (!groupDoc.members.includes(req.user?.id as any)) {
    throw new AppError('You must be a member of the group to create meetups', 403);
  }

  const meetup = await Meetup.create({
    title,
    description,
    group,
    dateTime,
    duration,
    location,
    minParticipants,
    maxParticipants,
    costPerPerson,
    createdBy: req.user?.id,
    participants: {
      confirmed: [req.user?.id], // Creator is automatically confirmed
      waitlist: [],
      guests: [],
    },
  });

  await meetup.populate('group createdBy', 'name profile.firstName profile.lastName');

  res.status(201).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});

export const getUserMeetups = catchAsync(async (req: Request, res: Response) => {
  const { status, upcoming } = req.query;

  let filter: any = {
    $or: [
      { 'participants.confirmed': req.user?.id },
      { 'participants.waitlist': req.user?.id },
      { 'participants.guests.user': req.user?.id },
      { createdBy: req.user?.id },
    ],
  };

  if (status) {
    filter.status = status;
  }

  if (upcoming === 'true') {
    filter.dateTime = { $gte: new Date() };
  }

  const meetups = await Meetup.find(filter)
    .populate('group', 'name')
    .populate('createdBy', 'profile.firstName profile.lastName')
    .sort({ dateTime: 1 });

  res.status(200).json({
    status: 'success',
    results: meetups.length,
    data: {
      meetups,
    },
  });
});

export const getMeetupById = catchAsync(async (req: Request, res: Response) => {
  const meetup = await Meetup.findById(req.params.id)
    .populate('group', 'name managers')
    .populate('createdBy', 'profile.firstName profile.lastName profile.profileImage')
    .populate('participants.confirmed', 'profile.firstName profile.lastName profile.profileImage profile.skillLevel')
    .populate('participants.waitlist', 'profile.firstName profile.lastName profile.profileImage')
    .populate('participants.guests.user', 'profile.firstName profile.lastName profile.profileImage')
    .populate('games');

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});

export const updateMeetup = catchAsync(async (req: Request, res: Response) => {
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  // Check permissions
  const group = await Group.findById(meetup.group);
  const isCreator = meetup.createdBy.toString() === req.user?.id;
  const isGroupManager = group?.managers.includes(req.user?.id as any);

  if (!isCreator && !isGroupManager) {
    throw new AppError('You do not have permission to update this meetup', 403);
  }

  const updatedMeetup = await Meetup.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('group createdBy', 'name profile.firstName profile.lastName');

  res.status(200).json({
    status: 'success',
    data: {
      meetup: updatedMeetup,
    },
  });
});

export const deleteMeetup = catchAsync(async (req: Request, res: Response) => {
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  // Check permissions
  const group = await Group.findById(meetup.group);
  const isCreator = meetup.createdBy.toString() === req.user?.id;
  const isGroupManager = group?.managers.includes(req.user?.id as any);

  if (!isCreator && !isGroupManager) {
    throw new AppError('You do not have permission to delete this meetup', 403);
  }

  await Meetup.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const registerForMeetup = catchAsync(async (req: Request, res: Response) => {
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  // Check if meetup is published and in the future
  if (meetup.status !== 'published') {
    throw new AppError('This meetup is not available for registration', 400);
  }

  if (meetup.dateTime <= new Date()) {
    throw new AppError('Cannot register for past meetups', 400);
  }

  const userId = req.user?.id;

  // Check if already registered
  if (meetup.participants.confirmed.includes(userId as any) ||
      meetup.participants.waitlist.includes(userId as any)) {
    throw new AppError('You are already registered for this meetup', 400);
  }

  // Add to confirmed or waitlist based on capacity
  if (meetup.participants.confirmed.length < meetup.maxParticipants) {
    meetup.participants.confirmed.push(userId as any);
  } else {
    meetup.participants.waitlist.push(userId as any);
  }

  // Update status if full
  if (meetup.participants.confirmed.length >= meetup.maxParticipants) {
    meetup.status = 'full';
  }

  await meetup.save();

  res.status(200).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});

export const cancelRegistration = catchAsync(async (req: Request, res: Response) => {
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  const userId = req.user?.id;

  // Remove from confirmed or waitlist
  meetup.participants.confirmed = meetup.participants.confirmed.filter(
    id => id.toString() !== userId
  );
  meetup.participants.waitlist = meetup.participants.waitlist.filter(
    id => id.toString() !== userId
  );

  // Move someone from waitlist to confirmed if there's space
  if (meetup.participants.waitlist.length > 0 && 
      meetup.participants.confirmed.length < meetup.maxParticipants) {
    const nextUser = meetup.participants.waitlist.shift();
    if (nextUser) {
      meetup.participants.confirmed.push(nextUser);
    }
  }

  // Update status
  if (meetup.participants.confirmed.length < meetup.maxParticipants && meetup.status === 'full') {
    meetup.status = 'published';
  }

  await meetup.save();

  res.status(200).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});

export const registerGuest = catchAsync(async (req: Request, res: Response) => {
  const { guestId } = req.body;
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  // Check if guest is already registered
  const existingGuest = meetup.participants.guests.find(
    guest => guest.user.toString() === guestId
  );

  if (existingGuest) {
    throw new AppError('Guest is already registered for this meetup', 400);
  }

  meetup.participants.guests.push({
    user: guestId,
    approved: false,
  });

  await meetup.save();

  res.status(200).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});

export const approveGuest = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { approved } = req.body;
  
  const meetup = await Meetup.findById(req.params.id);

  if (!meetup) {
    throw new AppError('Meetup not found', 404);
  }

  // Check permissions
  const group = await Group.findById(meetup.group);
  const isCreator = meetup.createdBy.toString() === req.user?.id;
  const isGroupManager = group?.managers.includes(req.user?.id as any);

  if (!isCreator && !isGroupManager) {
    throw new AppError('You do not have permission to approve guests', 403);
  }

  const guest = meetup.participants.guests.find(
    g => g.user.toString() === userId
  );

  if (!guest) {
    throw new AppError('Guest not found', 404);
  }

  guest.approved = approved;
  guest.approvedBy = req.user?.id as any;

  await meetup.save();

  res.status(200).json({
    status: 'success',
    data: {
      meetup,
    },
  });
});