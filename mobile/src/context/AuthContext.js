import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { updateBaseURL } from '../api/client';
import { DEFAULT_API_URL } from '../constants/theme';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(true);

  // Restore token and custom API URL on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUrl = await AsyncStorage.getItem('custom_api_url');
        if (storedUrl) {
          setApiUrl(storedUrl);
          updateBaseURL(storedUrl);
        }

        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify with server in background
          try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
            await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user));
          } catch (err) {
            console.log('Background token verify skipped/offline:', err.message);
          }
        }
      } catch (e) {
        console.warn('Failed to restore session:', e);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    await AsyncStorage.setItem('user_token', receivedToken);
    await AsyncStorage.setItem('user_data', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const register = async (username, email, password, fullName) => {
    const res = await api.post('/auth/register', { username, email, password, fullName });
    const { token: receivedToken, user: receivedUser } = res.data;

    await AsyncStorage.setItem('user_token', receivedToken);
    await AsyncStorage.setItem('user_data', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  };

  const saveCustomApiUrl = async (url) => {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    await AsyncStorage.setItem('custom_api_url', cleanUrl);
    setApiUrl(cleanUrl);
    updateBaseURL(cleanUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        apiUrl,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        saveCustomApiUrl,
      }}
    >
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
