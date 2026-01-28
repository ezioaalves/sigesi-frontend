import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    proxy: {
      // Proxy API requests to backend to avoid CORS during development
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/oauth2": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
