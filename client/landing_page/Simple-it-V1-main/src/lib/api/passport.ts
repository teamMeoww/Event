import { apiClient } from './client';

export const getMyPassport = async () => {
  return await apiClient.get('/passport/me');
};

export const getMyCredentials = async () => {
  return await apiClient.get('/credentials');
};

export const getCredentialById = async (credentialId: string) => {
  return await apiClient.get(`/credentials/${credentialId}`);
};

export const verifyCredentialPublic = async (credentialId: string) => {
  return await apiClient.get(`/verification/credential/${credentialId}`);
};

export const verifyTicketPublic = async (ticketId: string) => {
  return await apiClient.get(`/verification/ticket/${ticketId}`);
};
