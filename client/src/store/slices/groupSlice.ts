import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { groupsApi } from '../../services/api';
import { Group } from '../../types';

export interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  error: string | null;
  stats: any;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
  stats: null,
};

// Async thunks
export const fetchUserGroups = createAsyncThunk<
  { groups: Group[] },
  void,
  { rejectValue: string }
>(
  'groups/fetchUserGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getUserGroups();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

export const fetchGroupById = createAsyncThunk<
  { group: Group },
  string,
  { rejectValue: string }
>(
  'groups/fetchGroupById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getGroupById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch group');
    }
  }
);

export const createGroup = createAsyncThunk<
  { group: Group },
  Partial<Group>,
  { rejectValue: string }
>(
  'groups/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await groupsApi.createGroup(groupData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

export const updateGroup = createAsyncThunk<
  { group: Group },
  { id: string; data: Group},
  { rejectValue: string }
>(
  'groups/updateGroup',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await groupsApi.updateGroup(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update group');
    }
  }
);

export const deleteGroup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'groups/deleteGroup',
  async (id, { rejectWithValue }) => {
    try {
      await groupsApi.deleteGroup(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete group');
    }
  }
);

export const fetchGroupStats = createAsyncThunk<
  { stats: any },
  string,
  { rejectValue: string }
>(
  'groups/fetchGroupStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getGroupStats(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user groups
    builder
      .addCase(fetchUserGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups;
        state.error = null;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch group by ID
    builder
      .addCase(fetchGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload.group;
        state.error = null;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create group
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload.group);
        state.error = null;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update group
    builder
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex(g => g._id === action.payload.group._id);
        if (index !== -1) {
          state.groups[index] = action.payload.group;
        }
        if (state.currentGroup?._id === action.payload.group._id) {
          state.currentGroup = action.payload.group;
        }
        state.error = null;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete group
    builder
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter(g => g._id !== action.payload);
        if (state.currentGroup?._id === action.payload) {
          state.currentGroup = null;
        }
        state.error = null;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch group stats
    builder
      .addCase(fetchGroupStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchGroupStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;