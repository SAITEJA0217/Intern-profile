import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,        // ✅ REQUIRED
      autoRefreshToken: true,      // ✅ REQUIRED
      detectSessionInUrl: true     // ✅ REQUIRED for redirects
    }
  }
);

/* ================= DATABASE TYPES ================= */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          theme: string;
          privacy_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          theme?: string;
          privacy_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          theme?: string;
          privacy_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          mood: string;
          tags: string[];
          images: string[];
          entry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          content?: string;
          mood?: string;
          tags?: string[];
          images?: string[];
          entry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          mood?: string;
          tags?: string[];
          images?: string[];
          entry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
