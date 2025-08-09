import { Request, Response } from 'express';
import { Group } from '../models/group';
import { Meetup } from '../models/meetup';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createGroup = catchAsync(async (req: Request, res: Response) => {
  const { name, description, privacy, location, rules } = req.body;

  const group = await Group.create({
    name,
    description,
    privacy,
    location,
    rules,
    createdBy: req.user?.id,
    managers: [req.user?.id],
    members: [req.user?.id],
  });

  await group.populate('managers members', 'profile.firstName profile.lastName email');

  res.status(201).json({
    status: 'success',
    data: {
      group,
    },
  });
});

export const getUserGroups = catchAsync(async (req: Request, res: Response) => {
  const groups = await Group.find({
    members: req.user?.id,
  }).populate('managers members', 'profile.firstName profile.lastName profile.profileImage');

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
});

export const getGroupById = catchAsync(async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id)
    .populate('managers members', 'profile.firstName profile.lastName profile.profileImage email')
    .populate('createdBy', 'profile.firstName profile.lastName');

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

export const updateGroup = catchAsync(async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if user is a manager
  if (!group.managers.includes(req.user?.id as any)) {
    throw new AppError('You do not have permission to update this group', 403);
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('managers members', 'profile.firstName profile.lastName profile.profileImage');

  res.status(200).json({
    status: 'success',
    data: {
      group: updatedGroup,
    },
  });
});

export const deleteGroup = catchAsync(async (req: Request, res: Response) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if user is the creator
  if (group.createdBy.toString() !== req.user?.id) {
    throw new AppError('You do not have permission to delete this group', 403);
  }

  await Group.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const addMember = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if user is a manager
  if (!group.managers.includes(req.user?.id as any)) {
    throw new AppError('You do not have permission to add members to this group', 403);
  }

  // Check if user is already a member
  if (group.members.includes(userId)) {
    throw new AppError('User is already a member of this group', 400);
  }

  group.members.push(userId);
  await group.save();

  await group.populate('members', 'profile.firstName profile.lastName profile.profileImage');

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

export const removeMember = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Check if user is a manager or removing themselves
  if (!group.managers.includes(req.user?.id as any) && req.user?.id !== userId) {
    throw new AppError('You do not have permission to remove this member', 403);
  }

  group.members = group.members.filter(memberId => memberId.toString() !== userId);
  group.managers = group.managers.filter(managerId => managerId.toString() !== userId);
  
  await group.save();

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

export const getGroupStats = catchAsync(async (req: Request, res: Response) => {
  const groupId = req.params.id;

  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Get meetup statistics
  const totalMeetups = await Meetup.countDocuments({ group: groupId });
  const completedMeetups = await Meetup.countDocuments({ group: groupId, status: 'completed' });
  const upcomingMeetups = await Meetup.countDocuments({ 
    group: groupId, 
    status: 'published',
    dateTime: { $gte: new Date() }
  });

  // Get most active members
  const meetups = await Meetup.find({ group: groupId, status: 'completed' });
  const memberActivity: { [key: string]: number } = {};

  meetups.forEach(meetup => {
    meetup.participants.confirmed.forEach(memberId => {
      const id = memberId.toString();
      memberActivity[id] = (memberActivity[id] || 0) + 1;
    });
  });

  const stats = {
    totalMembers: group.members.length,
    totalMeetups,
    completedMeetups,
    upcomingMeetups,
    averageParticipation: completedMeetups > 0 ? 
      Object.values(memberActivity).reduce((a, b) => a + b, 0) / completedMeetups : 0,
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
