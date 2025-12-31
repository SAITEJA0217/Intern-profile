import { supabase } from './supabase';

export const databaseService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createEntry(entry: any) {
    const { data, error } = await supabase
      .from('entries')
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEntry(entryId: string, updates: any) {
    const { data, error } = await supabase
      .from('entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEntry(entryId: string) {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  },

  async getEntry(entryId: string) {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('id', entryId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getEntries(userId: string, limit?: number) {
    let query = supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async searchEntries(userId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('entry_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async filterEntries(userId: string, filters: { mood?: string; tags?: string[]; dateFrom?: string; dateTo?: string }) {
    let query = supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId);

    if (filters.mood) {
      query = query.eq('mood', filters.mood);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.dateFrom) {
      query = query.gte('entry_date', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('entry_date', filters.dateTo);
    }

    query = query.order('entry_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getMoodStats(userId: string) {
    const { data, error } = await supabase
      .from('entries')
      .select('mood')
      .eq('user_id', userId);

    if (error) throw error;

    const moodCounts: Record<string, number> = {};
    data?.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return moodCounts;
  },

  async getStreak(userId: string) {
    const { data, error } = await supabase
      .from('entries')
      .select('entry_date')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastEntryDate = new Date(data[0].entry_date);
    lastEntryDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) return 0;

    for (let i = 1; i < data.length; i++) {
      const currentDate = new Date(data[i - 1].entry_date);
      const prevDate = new Date(data[i].entry_date);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);

      const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
};
