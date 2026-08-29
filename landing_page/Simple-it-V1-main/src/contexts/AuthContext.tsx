'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getMe, login as apiLogin, register as apiRegister } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = async () => {
    setIsLoading(true);
    const token = Cookies.get('userToken');
    if (token) {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error('Session invalid:', err);
        Cookies.remove('userToken');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res: any = await apiLogin(email, pass);
      if (res && res.token) {
        Cookies.set('userToken', res.token, { expires: 7, secure: true, sameSite: 'strict' });
        await refreshSession();
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      await apiRegister(email, pass, name);
      await login(email, pass);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('userToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
