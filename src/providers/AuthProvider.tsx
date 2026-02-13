'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';

type AuthActionResult = {
  error: string | null;
};

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  isAuthenticated: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthActionResult>;
  signUpWithPassword: (email: string, password: string) => Promise<AuthActionResult>;
  signInWithGoogle: () => Promise<AuthActionResult>;
  signInAnonymously: () => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
}

const defaultValue: AuthContextValue = {
  session: null,
  user: null,
  isLoading: true,
  isConfigured: isSupabaseConfigured,
  isAuthenticated: false,
  signInWithPassword: async () => ({ error: 'Auth provider not ready.' }),
  signUpWithPassword: async () => ({ error: 'Auth provider not ready.' }),
  signInWithGoogle: async () => ({ error: 'Auth provider not ready.' }),
  signInAnonymously: async () => ({ error: 'Auth provider not ready.' }),
  signOut: async () => ({ error: 'Auth provider not ready.' }),
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

function getClientOrError() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return {
      client: null,
      error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }
  return { client, error: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      return;
    }

    let active = true;

    client.auth
      .getSession()
      .then(({ data }) => {
        if (!active) {
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading,
      isConfigured: isSupabaseConfigured,
      isAuthenticated: Boolean(user),
      signInWithPassword: async (email: string, password: string) => {
        const { client, error } = getClientOrError();
        if (error || !client) {
          return { error };
        }

        const { error: signInError } = await client.auth.signInWithPassword({ email, password });
        return { error: signInError?.message ?? null };
      },
      signUpWithPassword: async (email: string, password: string) => {
        const { client, error } = getClientOrError();
        if (error || !client) {
          return { error };
        }

        const { error: signUpError } = await client.auth.signUp({ email, password });
        return { error: signUpError?.message ?? null };
      },
      signInWithGoogle: async () => {
        const { client, error } = getClientOrError();
        if (error || !client) {
          return { error };
        }

        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : undefined;
        const { error: signInError } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });

        return { error: signInError?.message ?? null };
      },
      signInAnonymously: async () => {
        const { client, error } = getClientOrError();
        if (error || !client) {
          return { error };
        }

        const { error: anonError } = await client.auth.signInAnonymously();
        return { error: anonError?.message ?? null };
      },
      signOut: async () => {
        const { client, error } = getClientOrError();
        if (error || !client) {
          return { error };
        }

        const { error: signOutError } = await client.auth.signOut();
        return { error: signOutError?.message ?? null };
      },
    }),
    [session, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
