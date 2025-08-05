// Authentication service for handling login, logout, and token management
import ApiService from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  positionId: number;
  roleId?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface GoogleLoginData {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

class AuthService {
  // Login with email and password
  static async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await ApiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await ApiService.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.success && response.data) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  // Google login
  static async googleLogin(googleData: GoogleLoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await ApiService.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, googleData);
      
      if (response.success && response.data) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Google login failed. Please try again.'
      };
    }
  }

  // Verify token
  static async verifyToken(): Promise<ApiResponse<User>> {
    try {
      return await ApiService.get<User>(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
    } catch (error) {
      return {
        success: false,
        error: 'Token verification failed.'
      };
    }
  }

  // Get user profile
  static async getProfile(): Promise<ApiResponse<User>> {
    try {
      return await ApiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch profile.'
      };
    }
  }

  // Update user profile
  static async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await ApiService.put<User>(API_ENDPOINTS.AUTH.PROFILE, profileData);
      
      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile.'
      };
    }
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordData): Promise<ApiResponse<any>> {
    try {
      return await ApiService.post<any>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to change password.'
      };
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    try {
      return await ApiService.post<any>(API_ENDPOINTS.AUTH.REQUEST_RESET, { email });
    } catch (error) {
      return {
        success: false,
        error: 'Failed to request password reset.'
      };
    }
  }

  // Reset password with token
  static async resetPassword(resetData: ResetPasswordData): Promise<ApiResponse<any>> {
    try {
      return await ApiService.post<any>(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reset password.'
      };
    }
  }

  // Get all roles
  static async getRoles(): Promise<ApiResponse<any[]>> {
    try {
      return await ApiService.get<any[]>(API_ENDPOINTS.AUTH.ROLES);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch roles.'
      };
    }
  }

  // Get all positions
  static async getPositions(): Promise<ApiResponse<any[]>> {
    try {
      return await ApiService.get<any[]>(API_ENDPOINTS.AUTH.POSITIONS);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch positions.'
      };
    }
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/';
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Get current token
  static getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default AuthService;

