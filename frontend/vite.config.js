import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';


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
    https: {
      key: fs.readFileSync('./mkcerts/key.pem'),
      cert: fs.readFileSync('./mkcerts/cert.pem')

    },
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,
    strictPort: true,
  },
});
