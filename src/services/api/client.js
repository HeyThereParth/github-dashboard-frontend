import axios from 'axios';
import { supabase } from '@/lib/supabase';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Supabase access token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // In case session retrieval fails, proceed without header and let backend respond with 401
      console.error('[API Client] Failed to retrieve session for request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: 401 token refresh and single retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !data?.session) {
          // Refresh failed — sign out user and reject
          await supabase.auth.signOut();
          return Promise.reject(error);
        }

        const newToken = data.session.access_token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        await supabase.auth.signOut();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
