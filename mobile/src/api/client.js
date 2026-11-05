import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_API_URL } from '../constants/theme';

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
});

// Update base URL dynamically if user customizes it
export const updateBaseURL = (newURL) => {
  api.defaults.baseURL = newURL;
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const customUrl = await AsyncStorage.getItem('custom_api_url');
      if (customUrl) {
        config.baseURL = customUrl;
      }
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading storage in interceptor:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
