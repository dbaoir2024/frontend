// API service for the OIR Dashboard application
// Handles all API requests to the backend

import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosProgressEvent
} from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Generic API service class
class ApiService {
  // Generic GET request
  static async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const { data: responseData } = await apiClient.get<ApiResponse<T>>(url, { params });
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic POST request
  static async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: responseData } = await apiClient.post<ApiResponse<T>>(url, data);
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic PUT request
  static async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: responseData } = await apiClient.put<ApiResponse<T>>(url, data);
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic DELETE request
  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const { data: responseData } = await apiClient.delete<ApiResponse<T>>(url);
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Generic paginated GET request
  static async getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    try {
      const { data: responseData } = await apiClient.get<PaginatedResponse<T>>(url, { params });
      return responseData as PaginatedResponse<T>;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload with progress tracking
  static async uploadFile<T>(url: string, file: File, onProgress?: (percentage: number) => void): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data: responseData } = await apiClient.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentage);
          }
        },
      });
      
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Error handling
  private static handleError(error: any): ApiResponse<any> {
    if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      
      // Return error response from API if available
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
      
      // Network error
      if (axiosError.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
        };
      }
      
      if (!axiosError.response) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      }
    }
    
    // Generic error
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}

export default ApiService;
