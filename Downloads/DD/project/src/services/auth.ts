import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export const authService = {
  /* ================= SIGN UP ================= */

  async signUp(email: string, password: string, name: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    // create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      theme: 'light',
      privacy_mode: false,
    });

    if (profileError) throw profileError;

    return data.user;
  },

  /* ================= SIGN IN ================= */

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    return data.user;
  },

  /* ================= SIGN OUT ================= */

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /* ================= PASSWORD ================= */

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  /* ================= SESSION SAFE METHODS ================= */

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  },

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession();
    if (!session) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  },

  /* ================= LISTENER ================= */

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};
