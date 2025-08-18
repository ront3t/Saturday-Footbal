import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { meetupsApi } from '../../services/api';
import { Meetup } from '../../types';

export interface MeetupState {
  meetups: Meetup[];
  currentMeetup: Meetup | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: MeetupState = {
  meetups: [],
  currentMeetup: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const fetchUserMeetups = createAsyncThunk<
  { meetups: Meetup[] },
  { status?: string; upcoming?: boolean } | undefined,
  { rejectValue: string }
>(
  'meetups/fetchUserMeetups',
  async (params, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.getUserMeetups(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meetups');
    }
  }
);

export const fetchMeetupById = createAsyncThunk<
  { meetup: Meetup },
  string,
  { rejectValue: string }
>(
  'meetups/fetchMeetupById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.getMeetupById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meetup');
    }
  }
);

export const createMeetup = createAsyncThunk<
  { meetup: Meetup },
  Partial<Meetup>,
  { rejectValue: string }
>(
  'meetups/createMeetup',
  async (meetupData, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.createMeetup(meetupData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meetup');
    }
  }
);

export const updateMeetup = createAsyncThunk<
  { meetup: Meetup },
  { id: string; data: Meetup },
  { rejectValue: string }
>(
  'meetups/updateMeetup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.updateMeetup(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meetup');
    }
  }
);

export const deleteMeetup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'meetups/deleteMeetup',
  async (id, { rejectWithValue }) => {
    try {
      await meetupsApi.deleteMeetup(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meetup');
    }
  }
);

export const registerForMeetup = createAsyncThunk<
  { meetup: Meetup },
  string,
  { rejectValue: string }
>(
  'meetups/registerForMeetup',
  async (id, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.registerForMeetup(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register for meetup');
    }
  }
);

export const cancelRegistration = createAsyncThunk<
  { meetup: Meetup },
  string,
  { rejectValue: string }
>(
  'meetups/cancelRegistration',
  async (id, { rejectWithValue }) => {
    try {
      const response = await meetupsApi.cancelRegistration(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel registration');
    }
  }
);

const meetupSlice = createSlice({
  name: 'meetups',
  initialState,
  reducers: {
    clearCurrentMeetup: (state) => {
      state.currentMeetup = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch user meetups
    builder
      .addCase(fetchUserMeetups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMeetups.fulfilled, (state, action) => {
        state.loading = false;
        state.meetups = action.payload.meetups;
        state.error = null;
      })
      .addCase(fetchUserMeetups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch meetup by ID
    builder
      .addCase(fetchMeetupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetupById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeetup = action.payload.meetup;
        state.error = null;
      })
      .addCase(fetchMeetupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create meetup
    builder
      .addCase(createMeetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeetup.fulfilled, (state, action) => {
        state.loading = false;
        state.meetups.unshift(action.payload.meetup);
        state.error = null;
      })
      .addCase(createMeetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register for meetup
    builder
      .addCase(registerForMeetup.fulfilled, (state, action) => {
        if (state.currentMeetup?._id === action.payload.meetup._id) {
          state.currentMeetup = action.payload.meetup;
        }
        const index = state.meetups.findIndex(m => m._id === action.payload.meetup._id);
        if (index !== -1) {
          state.meetups[index] = action.payload.meetup;
        }
      });

    // Cancel registration
    builder
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        if (state.currentMeetup?._id === action.payload.meetup._id) {
          state.currentMeetup = action.payload.meetup;
        }
        const index = state.meetups.findIndex(m => m._id === action.payload.meetup._id);
        if (index !== -1) {
          state.meetups[index] = action.payload.meetup;
        }
      });
  },
});

export const { clearCurrentMeetup, clearError, setPage } = meetupSlice.actions;
export default meetupSlice.reducer;