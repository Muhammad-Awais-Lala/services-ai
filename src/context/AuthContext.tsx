import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface AuthenticatedUser {
  email: string;
  role: 'customer' | 'provider';
  accessToken: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  role: 'customer' | 'provider' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, role: 'customer' | 'provider') => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => { },
  signup: async () => { },
  logout: () => { },
  forgotPassword: async () => { },
  resetPassword: async () => { }
});

const API_BASE = 'https://services-agent.vercel.app';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('servicelink_current_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error reading current user:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });
      const data = res.data;

      const authUser: AuthenticatedUser = {
        email,
        role: 'customer',
        accessToken: data.access_token
      };

      await AsyncStorage.setItem('servicelink_current_user', JSON.stringify(authUser));
      setUser(authUser);
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string, role: 'customer' | 'provider') => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, name: fullName });
      console.log("Signup response:", res);

      const authUser: AuthenticatedUser = {
        email,
        role,
        accessToken: res.data.access_token
      };

      await AsyncStorage.setItem('servicelink_current_user', JSON.stringify(authUser));
      setUser(authUser);
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('servicelink_current_user');
    } catch (e) {
      console.error('Error logging out:', e);
    }
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to send reset link');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, { token, new_password: newPassword });
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to reset password');
    }
  };

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
