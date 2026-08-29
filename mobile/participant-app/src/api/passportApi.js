import apiClient from './client';

export const getMyPassport = async () => {
  return apiClient.get('/passport/me');
};

export const getMyCredentials = async () => {
  return apiClient.get('/credentials');
};

export const getCredentialById = async (id) => {
  return apiClient.get(`/credentials/${id}`);
};
