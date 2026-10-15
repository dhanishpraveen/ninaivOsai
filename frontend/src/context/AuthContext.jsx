import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session and set up auth state change listener
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthContext] Error retrieving session:', error.message);
          if (isMounted) setAuthError(error.message);
        }
        if (isMounted) {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] Unexpected error initializing session:', err);
        if (isMounted) {
          setAuthError(err?.message || 'Authentication initialization error');
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  }, []);

  const signUp = useCallback(async ({ email, password, fullName = '', options = {} }) => {
    setAuthError(null);
    const trimmedName = (fullName || '').trim();
    const mergedOptions = {
      ...options,
      data: {
        ...(options.data || {}),
        full_name: trimmedName || undefined,
        name: trimmedName || undefined,
      },
    };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: mergedOptions,
    });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    return data;
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    setUser(null);
    setSession(null);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Compute clean display name from user metadata
  const userName = useMemo(() => {
    if (!user) return '';
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      (user.email ? user.email.split('@')[0] : 'ஆவணக் காப்பாளர்')
    );
  }, [user]);

  // Compute initials (supports English and Tamil characters)
  const userInitials = useMemo(() => {
    if (!userName) return 'நோ';
    const words = userName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  }, [userName]);

  const value = useMemo(
    () => ({
      user,
      userName,
      userInitials,
      session,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      clearAuthError,
    }),
    [user, userName, userInitials, session, loading, authError, signIn, signUp, signOut, clearAuthError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
