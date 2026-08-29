import { apiClient } from './client';

export const getEvents = async (params = {}) => {
  return await apiClient.get('/events', { params });
};

export const getEventById = async (id: string) => {
  return await apiClient.get(`/events/${id}`);
};

export const registerForEvent = async (eventId: string, registrationData: any = {}) => {
  return await apiClient.post(`/events/${eventId}/register`, registrationData);
};
