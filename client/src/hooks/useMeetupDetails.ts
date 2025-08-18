import { useState, useEffect } from 'react';
import { meetupService } from '../services/meetupService';
import { Meetup } from '../types';

export const useMeetupDetails = (meetupId: string) => {
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetup = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await meetupService.getMeetupById(meetupId);
      setMeetup(response.data.meetup);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meetup details');
      console.error('Error fetching meetup:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetupId) {
      fetchMeetup();
    }
  }, [meetupId]);

  const registerForMeetup = async () => {
    try {
      const response = await meetupService.registerForMeetup(meetupId);
      setMeetup(response.data.meetup);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to register for meetup');
    }
  };

  const cancelRegistration = async () => {
    try {
      const response = await meetupService.cancelRegistration(meetupId);
      setMeetup(response.data.meetup);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const approveGuest = async (userId: string, approved: boolean) => {
    try {
      const response = await meetupService.approveGuest(meetupId, userId, approved);
      setMeetup(response.data.meetup);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update guest status');
    }
  };

  return {
    meetup,
    loading,
    error,
    registerForMeetup,
    cancelRegistration,
    approveGuest,
  };
};