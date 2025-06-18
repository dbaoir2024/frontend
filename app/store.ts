// Redux store configuration for the OIR Dashboard application
// Uses Redux Toolkit for simplified Redux setup

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import organizationReducer from '../features/organizations/organizationSlice';
import agreementReducer from '../features/agreements/agreementSlice';
import ballotReducer from '../features/ballots/ballotSlice';
import trainingReducer from '../features/trainings/trainingSlice';
import complianceReducer from '../features/compliance/complianceSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import uiReducer from '../features/ui/uiSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationReducer,
    agreements: agreementReducer,
    ballots: ballotReducer,
    trainings: trainingReducer,
    compliance: complianceReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginWithGoogle/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.lastLogin'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
