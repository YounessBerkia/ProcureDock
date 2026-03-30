import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API-Client Konfiguration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 Sekunden Timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Hier können z.B. Auth-Tokens hinzugefügt werden
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server hat mit Fehlerstatus geantwortet
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Keine Antwort vom Server
      console.error('Network Error:', error.message);
    } else {
      // Fehler beim Setup der Anfrage
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

// Hilfstypen für API-Responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
