import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import groupSlice from './slices/groupSlice';
import meetupSlice from './slices/meetupSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    groups: groupSlice,
    meetups: meetupSlice,
    users: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
