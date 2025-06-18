// Authentication service for the OIR Dashboard application
// Handles user authentication, registration, and session management

import ApiService from './api.service';
import { User, AuthState } from '../types';

class AuthService {
  // Login with email and password
  static async login(email: string, password: string): Promise<AuthState> {
    try {
      const response = await ApiService.post<{ user: User; token: string }>('/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        // Store token and user in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return {
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: response.error || 'Login failed',
      };
    } catch (error) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  // Login with Google
  static async loginWithGoogle(token: string): Promise<AuthState> {
    try {
      const response = await ApiService.post<{ user: User; token: string }>('/auth/google', {
        token,
      });

      if (response.success && response.data) {
        // Store token and user in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return {
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: response.error || 'Google login failed',
      };
    } catch (error) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Google login failed. Please try again.',
      };
    }
  }

  // Register new user
  static async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    positionId: number;
  }): Promise<AuthState> {
    try {
      const response = await ApiService.post<{ user: User; token: string }>('/auth/register', userData);

      if (response.success && response.data) {
        // Store token and user in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return {
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: response.error || 'Registration failed',
      };
    } catch (error) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  // Logout user
  static logout(): void {
    // Remove token and user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Get authentication token
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verify token validity
  static async verifyToken(): Promise<AuthState> {
    try {
      const response = await ApiService.get<User>('/auth/verify');

      if (response.success && response.data) {
        // Update user in local storage
        localStorage.setItem('user', JSON.stringify(response.data));

        return {
          user: response.data,
          token: this.getToken(),
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }

      // Token is invalid, clear storage
      this.logout();

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: response.error || 'Session expired',
      };
    } catch (error) {
      // Error verifying token, clear storage
      this.logout();

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session verification failed',
      };
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await ApiService.post<{ success: boolean }>('/auth/request-reset', { email });
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Reset password with token
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const response = await ApiService.post<{ success: boolean }>('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await ApiService.post<{ success: boolean }>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await ApiService.put<User>('/auth/profile', userData);

      if (response.success && response.data) {
        // Get current user from storage
        const currentUser = this.getCurrentUser();
        
        // Update user in local storage
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;
