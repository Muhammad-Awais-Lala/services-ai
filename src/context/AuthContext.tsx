import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export interface AuthenticatedUser {
  email: string; // The user's ID
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
    const storedUser = localStorage.getItem('servicelink_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error reading current user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });
      const data = res.data;
      // Returns { access_token: "...", token_type: "bearer" }

      const authUser: AuthenticatedUser = {
        email,
        role: 'customer',
        accessToken: data.access_token
      };

      localStorage.setItem('servicelink_current_user', JSON.stringify(authUser));
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
      console.log("pay res======>", res);

      // Auto-login after signup, or just throw if we need to verify email
      // PDF says: "Open the verification link from email or server logs. POST /auth/login"
      // If we can't auto-login, we just tell the user to verify.
      throw new Error('Signup successful! Please check your email/server logs to verify your account before logging in.');
    } catch (err: any) {
      if (err.message && err.message.includes('Signup successful!')) throw err;
      throw new Error(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('servicelink_current_user');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to request reset');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, { token, new_password: newPassword });
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to reset password');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loading, login, signup, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
