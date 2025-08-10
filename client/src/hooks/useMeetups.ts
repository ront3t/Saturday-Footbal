import { useState, useEffect } from 'react';
import { meetupService, MeetupsQuery } from '../services/meetupService';
import { Meetup } from '../types';

export const useMeetups = (query: MeetupsQuery = {}) => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchMeetups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await meetupService.getUserMeetups(query);
      setMeetups(response.data.meetups);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meetups');
      console.error('Error fetching meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, [JSON.stringify(query)]);

  const registerForMeetup = async (meetupId: string) => {
    try {
      await meetupService.registerForMeetup(meetupId);
      // Update local state
      setMeetups(prev => prev.map(meetup => {
        if (meetup._id === meetupId) {
          // Add current user to participants - you'll need user context
          return { ...meetup /* update participants */ };
        }
        return meetup;
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to register for meetup');
    }
  };

  const cancelRegistration = async (meetupId: string) => {
    try {
      await meetupService.cancelRegistration(meetupId);
      // Update local state
      setMeetups(prev => prev.map(meetup => {
        if (meetup._id === meetupId) {
          // Remove current user from participants
          return { ...meetup /* update participants */ };
        }
        return meetup;
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  return {
    meetups,
    loading,
    error,
    pagination,
    refetch: fetchMeetups,
    registerForMeetup,
    cancelRegistration,
  };
};