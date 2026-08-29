import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, register as registerApi, getMe as getMeApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const loadToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        setUserToken(token);
        // Optionally fetch user info if needed here
        try {
            const meData = await getMeApi();
            setUserInfo(meData);
        } catch (e) {
            console.log("Could not load user profile, token might be expired.");
            await logout();
        }
      }
    } catch (e) {
      console.warn("Failed to load token", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await loginApi(email, password);
      // Backend returns { token: "..." }
      if (response && response.token) {
        setUserToken(response.token);
        await SecureStore.setItemAsync('userToken', response.token);
        
        // Fetch User Info
        try {
            const meData = await getMeApi();
            setUserInfo(meData);
        } catch (e) {}
      } else {
        throw new Error("Invalid login response");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      await registerApi(email, password, name);
      // Auto login after register
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await SecureStore.deleteItemAsync('userToken');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
