import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],

  define: {
    "process.env": {},
  },

  resolve: {
    alias: {
      // Alias для Cesium
      cesium: "cesium/Build/Cesium",
    },
  },

  server: {
    proxy: {
      //  proxy для Cesium 
      "/cesium": {
        target: "https://unpkg.com/cesium@1.113.0/Build/Cesium",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cesium/, ""),
      },

      // proxy для backend API 
      "/map": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
