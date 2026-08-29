import apiClient from './client';

export const getMyTickets = async () => {
  return apiClient.get('/tickets');
};

export const getTicketById = async (id) => {
  return apiClient.get(`/tickets/${id}`);
};

export const getTicketQr = async (id) => {
  return apiClient.get(`/tickets/${id}/qr`);
};
