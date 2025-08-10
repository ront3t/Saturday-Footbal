import api from './api';
import { Group } from '../types';

export interface GroupsQuery {
  search?: string;
  privacy?: 'public' | 'private' | 'invite-only';
  location?: string;
  page?: number;
  limit?: number;
}

export interface GroupsResponse {
  status: string;
  results: number;
  data: {
    groups: Group[];
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const groupService = {
  // Get user's groups
  async getUserGroups(): Promise<GroupsResponse> {
    const response = await api.get('/groups');
    return response.data;
  },

  // Get all groups with filters
  async getAllGroups(query: GroupsQuery = {}): Promise<GroupsResponse> {
    const params = new URLSearchParams();
    
    if (query.search) params.append('search', query.search);
    if (query.privacy) params.append('privacy', query.privacy);
    if (query.location) params.append('location', query.location);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const response = await api.get(`/groups/public?${params.toString()}`);
    return response.data;
  },

  // Get group by ID
  async getGroupById(id: string): Promise<{ status: string; data: { group: Group } }> {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  // Create group
  async createGroup(groupData: Partial<Group>): Promise<{ status: string; data: { group: Group } }> {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Join group
  async joinGroup(groupId: string): Promise<{ status: string; data: { group: Group } }> {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Leave group
  async leaveGroup(groupId: string): Promise<{ status: string; data: { group: Group } }> {
    const response = await api.delete(`/groups/${groupId}/leave`);
    return response.data;
  },
};