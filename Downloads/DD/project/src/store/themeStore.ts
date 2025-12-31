import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'sepia';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',

  setTheme: (theme) => {
    // remove old themes
    document.documentElement.classList.remove('light', 'dark', 'sepia');

    // apply new theme to <html>
    document.documentElement.classList.add(theme);

    set({ theme });
  },
}));
