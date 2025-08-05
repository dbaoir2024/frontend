// Updated API service with CORS and authentication fixes
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

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // Crucial for CORS with credentials
});

// Enhanced request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add CORS headers for requests that need them
      if (import.meta.env.DEV) {
        config.headers['Access-Control-Allow-Origin'] = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5175';
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    if (response.headers['access-control-allow-origin']) {
      // Store the allowed origin if provided by server
      localStorage.setItem('last-allowed-origin', response.headers['access-control-allow-origin']);
    }
    return response;
  },
  (error: AxiosError) => {
    // Enhanced error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleUnauthorized();
          break;
        case 403:
          console.error('Forbidden:', error);
          window.location.href = '/unauthorized';
          break;
        case 500:
          console.error('Server error:', error);
          break;
        default:
          console.error('API error:', error);
      }
      
      // Check for CORS headers in error response
      if (!error.response.headers['access-control-allow-origin']) {
        console.warn('Missing CORS headers in error response');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
    } else {
      console.error('Network error:', error);
    }
    
    return Promise.reject(error);
  }
);

function handleUnauthorized() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Use window.location instead of navigate to ensure full page reload
  window.location.href = '/login?session_expired=true';
}

class ApiService {
  // Add CORS headers specifically for sensitive endpoints
  private static getCorsConfig(): AxiosRequestConfig {
    return {
      headers: {
      // Remove the incorrect Access-Control-Allow-Origin and Access-Control-Allow-Credentials headers from the request
      // 'Access-Control-Allow-Origin': import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5175',
      // 'Access-Control-Allow-Credentials': 'true'
      }
    };
  }

  static async post<T>(url: string, data: any, requireCors = true): Promise<ApiResponse<T>> {
    try {
      const config = requireCors ? this.getCorsConfig() : {};
      const { data: responseData } = await apiClient.post<ApiResponse<T>>(url, data, config);
      return responseData as ApiResponse<T>;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // [Keep all other methods unchanged but add optional requireCors parameter]
  
  // Enhanced error handling
  private static handleError(error: any): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      
      // Handle CORS-related errors specifically
      if (!axiosError.response && axiosError.message.includes('CORS')) {
        return {
          success: false,
          error: 'Cross-origin request blocked. Please try again or contact support.',
          corsError: true
        };
      }
      
      // [Rest of your existing error handling]
    }
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}

export default ApiService;