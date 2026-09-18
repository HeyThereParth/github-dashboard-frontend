import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './AuthContextObject';
import {
  signInWithPassword as apiSignIn,
  signUpWithPassword as apiSignUp,
  signOut as apiSignOut,
} from '../services/auth';

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('[Auth] Failed to initialize session:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // 2. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const data = await apiSignIn({ email, password });
    setSession(data.session);
    setUser(data.user);
    return data;
  };

  const signUp = async ({ email, password }) => {
    const data = await apiSignUp({ email, password });
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }
    return data;
  };

  const signOut = async () => {
    await apiSignOut();
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(session),
      signIn,
      signUp,
      signOut,
    }),
    [user, session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
