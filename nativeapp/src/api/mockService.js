// Mock API Service for Authentication

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_TOKEN = 'mock_jwt_token_12345';

export const mockLogin = async (email, password) => {
  await delay(1000);
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  if (email === 'test@test.com' && password === 'wrong') {
     throw new Error('Invalid credentials');
  }
  return { token: MOCK_TOKEN, user: { name: 'Anubhav', email } };
};

export const mockRegister = async (data) => {
  await delay(1000);
  if (!data.email || !data.password || !data.name) {
    throw new Error('All fields are required');
  }
  return { token: MOCK_TOKEN, user: { name: data.name, email: data.email } };
};

export const mockForgotPassword = async (email) => {
  await delay(1000);
  if (!email) {
    throw new Error('Email is required');
  }
  return { message: 'Password reset link sent' };
};
