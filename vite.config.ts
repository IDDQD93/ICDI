import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      // Alias для Cesium
      cesium: 'cesium/Build/Cesium'
    },
  },
  server: {
    proxy: {
      '/cesium': 'https://unpkg.com/cesium@1.113.0/Build/Cesium',
    },
  },
});
