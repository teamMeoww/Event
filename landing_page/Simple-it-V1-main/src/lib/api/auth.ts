import { apiClient } from './client';

export const login = async (email: string, password: string) => {
  return await apiClient.post('/auth/login', { email, password });
};

export const register = async (email: string, password: string, name: string) => {
  return await apiClient.post('/auth/register', { email, password, name });
};

export const getMe = async () => {
  return await apiClient.get('/auth/me'); // Or the equivalent endpoint to fetch user profile
};
