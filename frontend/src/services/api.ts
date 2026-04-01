import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// api client setup - base url comes from env or defaults to localhost
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // TODO: add auth token from localStorage here when we have auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // no response from server
      console.error('Network Error:', error.message);
    } else {
      // error setting up the request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Type-Safe API Wrapper
export const api = {
  get: <T>(url: string, params?: object) =>
    apiClient.get<T>(url, { params }),
  post: <T>(url: string, data?: object) =>
    apiClient.post<T>(url, data),
  put: <T>(url: string, data?: object) =>
    apiClient.put<T>(url, data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url),
};

export default apiClient;

// helper types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
