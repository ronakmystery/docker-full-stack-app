import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Enables polling to detect file changes
    },
    cors: true, //  Enables CORS for all origins
    allowedHosts: true, //  Fully allows all hosts, including Ngrok
    headers: {
      "Access-Control-Allow-Origin": "*", //  Ensures CORS works across all origins
    },
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 443,
      path: '/hmr/ws' // matches nginx location
    }
  }
  
});
