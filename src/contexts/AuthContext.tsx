/**
 * Contexto de Autenticação - Supabase
 * Gerencia login, registro e sessão do usuário
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, authService, profileService, Profile } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão inicial
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await loadSession();

      // Listener para mudanças de autenticação (só se conectado)
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return;
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (newSession?.user) {
              await loadProfile(newSession.user.id);
            } else {
              setProfile(null);
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.log('Auth listener error (offline)');
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const loadSession = async () => {
    try {
      setIsLoading(true);

      // Timeout de 3 segundos para não travar o app
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );

      const sessionPromise = authService.getSession();

      const result = await Promise.race([sessionPromise, timeoutPromise]) as any;

      if (result?.error) {
        console.log('Session error (offline mode):', result.error.message);
        return;
      }

      if (result?.session) {
        setSession(result.session);
        setUser(result.session.user ?? null);

        if (result.session.user) {
          await loadProfile(result.session.user.id);
        }
      }
    } catch (error: any) {
      // Erro de conexão ou timeout - continuar em modo offline
      console.log('Auth offline mode:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { profile: userProfile, error } = await profileService.getProfile(userId);
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await authService.signUp(email, password, name);
      if (error) return { error };

      // Se o signup requer confirmação de email, retornar sem erro
      if (data.user && !data.session) {
        return { error: null };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) return { error };

      setSession(data.session);
      setUser(data.user);

      if (data.user) {
        await loadProfile(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { profile: updatedProfile, error } = await profileService.updateProfile(
        user.id,
        updates
      );

      if (error) return { error };

      setProfile(updatedProfile);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
