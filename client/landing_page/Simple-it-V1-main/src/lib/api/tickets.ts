import { apiClient } from './client';

export const getMyTickets = async () => {
  return await apiClient.get('/tickets');
};

export const getTicketById = async (ticketId: string) => {
  return await apiClient.get(`/tickets/${ticketId}`);
};

export const getTicketQr = async (ticketId: string) => {
  return await apiClient.get(`/tickets/${ticketId}/qr`);
};
