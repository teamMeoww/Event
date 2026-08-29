import apiClient from './client';

export const getWalletStatus = async () => {
  return apiClient.get('/wallet');
};

export const requestWalletChallenge = async (address) => {
  return apiClient.post('/wallet/challenge', { address });
};

export const verifyWalletSignature = async (address, nonce, signature) => {
  return apiClient.post('/wallet/verify', { address, nonce, signature });
};

export const disconnectWallet = async () => {
  return apiClient.delete('/wallet');
};
