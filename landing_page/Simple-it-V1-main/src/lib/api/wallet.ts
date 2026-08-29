import { apiClient } from './client';

export const getWalletStatus = async () => {
  return await apiClient.get('/wallet');
};

export const requestWalletChallenge = async (address: string) => {
  return await apiClient.post('/wallet/challenge', { address });
};

export const verifyWalletSignature = async (address: string, nonce: string, signature: string) => {
  return await apiClient.post('/wallet/verify', { address, nonce, signature });
};

export const disconnectWallet = async () => {
  return await apiClient.delete('/wallet');
};
