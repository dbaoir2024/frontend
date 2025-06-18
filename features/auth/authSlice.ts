// Auth slice for Redux store
// Manages authentication state using Redux Toolkit

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import AuthService from '../../services/auth.service';

// Initial state
const initialState: AuthState = {
  user: AuthService.getCurrentUser(),
  token: AuthService.getToken(),
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
  error: null,
};

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      if (!response.isAuthenticated) {
        return rejectWithValue(response.error || 'Login failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginWithGoogle(token);
      if (!response.isAuthenticated) {
        return rejectWithValue(response.error || 'Google login failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Google login failed. Please try again.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      positionId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.register(userData);
      if (!response.isAuthenticated) {
        return rejectWithValue(response.error || 'Registration failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const verifyToken = createAsyncThunk('auth/verifyToken', async (_, { rejectWithValue }) => {
  try {
    const response = await AuthService.verifyToken();
    if (!response.isAuthenticated) {
      return rejectWithValue(response.error || 'Session expired');
    }
    return response;
  } catch (error) {
    return rejectWithValue('Session verification failed');
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await AuthService.updateProfile(userData);
      if (!response) {
        return rejectWithValue('Profile update failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Profile update failed. Please try again.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      AuthService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Google Login
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
