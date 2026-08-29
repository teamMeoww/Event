import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Attempt to retrieve token from cookies for SSR compatibility
    const token = Cookies.get('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Depending on Spring Backend's structure, we might need to unwrap ApiResponse
    if (response.data && response.data.data !== undefined) {
       return response.data.data;
    }
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Handle known API error payload structure
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        switch (error.response.status) {
          case 401:
            message = 'Unauthorized. Please log in.';
            // Handle global logout event
            Cookies.remove('userToken');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
            break;
          case 403:
            message = 'You do not have permission for this action.';
            break;
          case 404:
            message = 'Resource not found.';
            break;
          case 409:
            message = 'Conflict. This resource already exists or state is invalid.';
            break;
          case 422:
            message = 'Validation error. Please check your inputs.';
            break;
          case 500:
            message = 'Internal server error.';
            break;
        }
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    }

    return Promise.reject(new Error(message));
  }
);
