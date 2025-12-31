import { supabase } from './supabase';

export const storageService = {
  async uploadImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('diary-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('diary-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async deleteImage(url: string) {
    const path = url.split('/diary-images/')[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from('diary-images')
      .remove([path]);

    if (error) throw error;
  },
};
