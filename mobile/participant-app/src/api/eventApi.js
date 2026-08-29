import apiClient from './client';

export const getEvents = async () => {
  return apiClient.get('/events');
};

export const getEventById = async (id) => {
  return apiClient.get(`/events/${id}`);
};

export const registerForEvent = async (eventId, walletAddress, blockchainEnabled) => {
  return apiClient.post('/tickets', {
    eventId,
    walletAddress,
    blockchainEnabled
  });
};
