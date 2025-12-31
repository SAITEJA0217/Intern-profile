import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'InternLink',
        short_name: 'InternLink',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
      },
    }),
  ],
});
