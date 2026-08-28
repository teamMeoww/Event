import React, { createContext, useState, useEffect } from 'react';
import { saveToken, getToken, deleteToken } from '../utils/storage';
import { mockLogin, mockRegister } from '../api/mockService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check if token exists on app load
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await getToken();
      } catch (e) {
        // Restoring token failed
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await mockLogin(email, password);
      setUserToken(response.token);
      await saveToken(response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (data) => {
    try {
      const response = await mockRegister(data);
      setUserToken(response.token);
      await saveToken(response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await deleteToken();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
