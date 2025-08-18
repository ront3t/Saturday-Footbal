import { Game, Group, Meetup, Team, User, UserStats } from '@/types';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure we're sending the token in the correct format
      // Remove any quotes or extra characters that might be stored
      const cleanToken = token.replace(/"/g, '').trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API response type
interface ApiResponse<T = any> {
  status: string;
  data: T;
  message?: string;
  results?: number;
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/login', credentials),

  register: (userData: Partial<User>): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/register', userData),

  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/logout'),
  resetPassword: (token: string, password: string): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/auth/reset-password/${token}`, { password }),

  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/users/profile'),

  updateProfile: (profileData: Partial<User['profile']>): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.put('/users/profile', profileData),
};

// Groups API
export const groupsApi = {
  createGroup: (groupData: Partial<Group>): Promise<AxiosResponse<ApiResponse<{ group: Group }>>> =>
    api.post('/groups', groupData),

  getUserGroups: (): Promise<AxiosResponse<ApiResponse<{ groups: Group[] }>>> =>
    api.get('/groups'),

  getGroupById: (id: string): Promise<AxiosResponse<ApiResponse<{ group: Group }>>> =>
    api.get(`/groups/${id}`),

  updateGroup: (id: string, groupData: Group): Promise<AxiosResponse<ApiResponse<{ group: Group }>>> =>
    api.put(`/groups/${id}`, groupData),

  deleteGroup: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/groups/${id}`),

  addMember: (id: string, userId: string): Promise<AxiosResponse<ApiResponse<{ group: Group }>>> =>
    api.post(`/groups/${id}/members`, { userId }),

  removeMember: (id: string, userId: string): Promise<AxiosResponse<ApiResponse<{ group: Group }>>> =>
    api.delete(`/groups/${id}/members/${userId}`),

  getGroupStats: (id: string): Promise<AxiosResponse<ApiResponse<{ stats: UserStats }>>> =>
    api.get(`/groups/${id}/stats`),
};

// Meetups API
export const meetupsApi = {
  createMeetup: (meetupData: Partial<Meetup>): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.post('/meetups', meetupData),

  getUserMeetups: (params?: { status?: string; upcoming?: boolean }): Promise<AxiosResponse<ApiResponse<{ meetups: Meetup[] }>>> =>
    api.get('/meetups', { params }),

  getMeetupById: (id: string): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.get(`/meetups/${id}`),

  updateMeetup: (id: string, meetupData: Meetup): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.put(`/meetups/${id}`, meetupData),

  deleteMeetup: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/meetups/${id}`),

  registerForMeetup: (id: string): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.post(`/meetups/${id}/register`),

  cancelRegistration: (id: string): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.delete(`/meetups/${id}/register`),

  registerGuest: (id: string, guestId: string): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.post(`/meetups/${id}/guests`, { guestId }),

  approveGuest: (id: string, userId: string, approved: boolean): Promise<AxiosResponse<ApiResponse<{ meetup: Meetup }>>> =>
    api.put(`/meetups/${id}/guests/${userId}`, { approved }),
};

// Users API
export const usersApi = {
  getUserById: (id: string): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get(`/users/${id}`),

  getUserStats: (id: string): Promise<AxiosResponse<ApiResponse<{ stats: UserStats }>>> =>
    api.get(`/users/${id}/stats`),
};

// Teams API
export const teamsApi = {
  createTeam: (teamData: Team): Promise<AxiosResponse<ApiResponse<{ team: Team }>>> =>
    api.post('/teams', teamData),

  getTeamById: (id: string): Promise<AxiosResponse<ApiResponse<{ team: Team }>>> =>
    api.get(`/teams/${id}`),

  updateTeam: (id: string, teamData: Team): Promise<AxiosResponse<ApiResponse<{ team: Team }>>> =>
    api.put(`/teams/${id}`, teamData),

  deleteTeam: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/teams/${id}`),

  addPlayer: (id: string, userId: string): Promise<AxiosResponse<ApiResponse<{ team: Team }>>> =>
    api.post(`/teams/${id}/players`, { userId }),

  removePlayer: (id: string, userId: string): Promise<AxiosResponse<ApiResponse<{ team: Team }>>> =>
    api.delete(`/teams/${id}/players/${userId}`),
};

// Games API
export const gamesApi = {
  createGame: (gameData: Game): Promise<AxiosResponse<ApiResponse<{ game: Game }>>> =>
    api.post('/games', gameData),

  getGameById: (id: string): Promise<AxiosResponse<ApiResponse<{ game: Game }>>> =>
    api.get(`/games/${id}`),

  updateGame: (id: string, gameData: Game): Promise<AxiosResponse<ApiResponse<{ game: Game }>>> =>
    api.put(`/games/${id}`, gameData),

  addGameEvent: (id: string, eventData: Game): Promise<AxiosResponse<ApiResponse<{ game: Game }>>> =>
    api.post(`/games/${id}/events`, eventData),

  updateGameEvent: (id: string, eventId: string, eventData: Game): Promise<AxiosResponse<ApiResponse<{ game: Game }>>> =>
    api.put(`/games/${id}/events/${eventId}`, eventData),
};

export default api;
