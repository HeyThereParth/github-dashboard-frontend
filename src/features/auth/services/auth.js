import { supabase } from '@/lib/supabase';
import apiClient from '@/services/api/client';

/**
 * Sign in using Supabase Auth email and password.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, session: object }>}
 */
export const signInWithPassword = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign up a new user using Supabase Auth.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, session: object }>}
 */
export const signUpWithPassword = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign out of current Supabase session.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Get active Supabase session.
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};

/**
 * Refresh Supabase session.
 */
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    throw error;
  }
  return data.session;
};

/**
 * Fetch current user details from the FastAPI backend.
 *
 * @returns {Promise<{ id: string, email: string | null, name: string | null, avatar_url: string | null, created_at: string, updated_at: string }>}
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/v1/me');
  return response.data;
};

export default {
  signInWithPassword,
  signUpWithPassword,
  signOut,
  getSession,
  refreshSession,
  getCurrentUser,
};
