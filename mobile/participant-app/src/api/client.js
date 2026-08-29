import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Default to 10.0.2.2 for Android emulator to hit localhost, or fallback to docker gateway
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to retrieve token for request", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors gracefully
apiClient.interceptors.response.use(
  (response) => {
    // Return actual data block if API response is wrapped in our ApiResponse object
    if (response.data && response.data.data !== undefined) {
       return response.data.data;
    }
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      if (error.response.status === 401) {
        // Optionally trigger global logout event here
        message = 'Session expired. Please log in again.';
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = `Server Error: ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    }
    
    // Normalize error
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
