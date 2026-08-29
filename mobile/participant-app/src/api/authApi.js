import apiClient from './client';

export const login = async (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const register = async (email, password, name) => {
  return apiClient.post('/auth/register', { email, password, name, role: 'USER' });
};

export const getMe = async () => {
  // If your backend has a /me endpoint. If not, passport/me can serve as user info.
  return apiClient.get('/passport/me');
};
