import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../services/api';
import { User } from '@/types';

export interface UserStats {
  gamesPlayed: number;
  meetupsAttended: number;
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  averageGoalsPerGame: string;
  averageAssistsPerGame: string;
}

export interface UserState {
  selectedUser: User | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  selectedUser: null,
  userStats: null,
  loading: false,
  error: null,
};

export const fetchUserById = createAsyncThunk<
  { user: any },
  string,
  { rejectValue: string }
>(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUserById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const fetchUserStats = createAsyncThunk<
  { stats: UserStats },
  string,
  { rejectValue: string }
>(
  'users/fetchUserStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUserStats(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUserStats: (state) => {
      state.userStats = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser, clearUserStats, clearError } = userSlice.actions;
export default userSlice.reducer;
