import { apiClient } from './client';

export const getWalletStatus = async () => {
  return await apiClient.get('/wallet');
};

export const requestWalletChallenge = async (walletAddress: string) => {
  return await apiClient.post('/wallet/challenge', { walletAddress });
};

export const verifyWalletSignature = async (walletAddress: string, nonce: string, signature: string) => {
  return await apiClient.post('/wallet/verify', { walletAddress, nonce, signature });
};

export const disconnectWallet = async () => {
  return await apiClient.delete('/wallet');
};
