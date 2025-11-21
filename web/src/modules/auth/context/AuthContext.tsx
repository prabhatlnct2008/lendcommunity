/**
 * Auth Context - Manages authentication state
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';
import type { User, AuthToken } from '../api/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  setAuthData: (authToken: AuthToken) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authAPI.getCurrentUser(storedToken);
          setToken(storedToken);
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to verify stored token:', error);
          // Clear invalid token
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async () => {
    try {
      // Get Google OAuth URL
      const { authorization_url, state } = await authAPI.getGoogleLoginUrl();

      // Store state for verification
      sessionStorage.setItem('oauth_state', state);

      // Redirect to Google OAuth
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Failed to initiate login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  }, []);

  const setAuthData = useCallback((authToken: AuthToken) => {
    setToken(authToken.access_token);
    setUser(authToken.user);

    // Persist to localStorage
    localStorage.setItem('auth_token', authToken.access_token);
    localStorage.setItem('auth_user', JSON.stringify(authToken.user));
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    setAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
