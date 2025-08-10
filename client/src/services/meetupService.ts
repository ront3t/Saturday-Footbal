import api from './api';
import { Meetup } from '../types';

export interface MeetupsQuery {
  search?: string;
  status?: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  upcoming?: boolean;
  groupId?: string;
  page?: number;
  limit?: number;
}

export interface MeetupsResponse {
  status: string;
  results: number;
  data: {
    meetups: Meetup[];
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const meetupService = {
  // Get user's meetups
  async getUserMeetups(query: MeetupsQuery = {}): Promise<MeetupsResponse> {
    const params = new URLSearchParams();
    
    if (query.status) params.append('status', query.status);
    if (query.upcoming !== undefined) params.append('upcoming', query.upcoming.toString());
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const response = await api.get(`/meetups?${params.toString()}`);
    return response.data;
  },

  // Get all meetups with filters
  async getAllMeetups(query: MeetupsQuery = {}): Promise<MeetupsResponse> {
    const params = new URLSearchParams();
    
    if (query.search) params.append('search', query.search);
    if (query.status) params.append('status', query.status);
    if (query.upcoming !== undefined) params.append('upcoming', query.upcoming.toString());
    if (query.groupId) params.append('groupId', query.groupId);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const response = await api.get(`/meetups/public?${params.toString()}`);
    return response.data;
  },

  // Get meetup by ID
  async getMeetupById(id: string): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.get(`/meetups/${id}`);
    return response.data;
  },

  // Create meetup
  async createMeetup(meetupData: Partial<Meetup>): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.post('/meetups', meetupData);
    return response.data;
  },

  // Register for meetup
  async registerForMeetup(meetupId: string): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.post(`/meetups/${meetupId}/register`);
    return response.data;
  },

  // Cancel registration
  async cancelRegistration(meetupId: string): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.delete(`/meetups/${meetupId}/register`);
    return response.data;
  },

  // Register guest
  async registerGuest(meetupId: string, guestId: string): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.post(`/meetups/${meetupId}/guests`, { guestId });
    return response.data;
  },

  // Approve/reject guest
  async approveGuest(meetupId: string, userId: string, approved: boolean): Promise<{ status: string; data: { meetup: Meetup } }> {
    const response = await api.put(`/meetups/${meetupId}/guests/${userId}`, { approved });
    return response.data;
  },
};