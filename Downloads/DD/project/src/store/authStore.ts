import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { databaseService } from '../services/database';

/* ================= TYPES ================= */

interface Profile {
  id: string;
  name: string;
  email: string;
  theme: string;
  privacy_mode: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;

  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  initialize: () => Promise<void>;
}

/* ================= STORE ================= */

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  /* ---------- AUTH ---------- */

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const user = await authService.signIn(email, password);
      set({ user });
      await get().loadProfile();
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true });
    try {
      const user = await authService.signUp(email, password, name);
      set({ user });
      await get().loadProfile();
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await authService.signOut();
      set({ user: null, profile: null });
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- PROFILE ---------- */

  loadProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const profile = await databaseService.getProfile(user.id);
      set({ profile });
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    try {
      const updatedProfile = await databaseService.updateProfile(
        user.id,
        updates
      );
      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  /* ---------- INITIALIZE (VERY IMPORTANT) ---------- */

  initialize: async () => {
    set({ loading: true });

    try {
      /**
       * ✅ SAFE AUTH FLOW
       * 1. Check session
       * 2. Only then get user
       */
      const session = await authService.getSession();

      if (!session) {
        set({ user: null, profile: null });
        return;
      }

      const user = await authService.getCurrentUser();
      set({ user });

      if (user) {
        await get().loadProfile();
      }
    } finally {
      set({ loading: false, initialized: true });
    }
  },
}));
