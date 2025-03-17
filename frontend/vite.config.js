import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Runs on a fixed port
    host: "0.0.0.0", //  Allows external access
    watch: {
      usePolling: true, // Enables polling to detect file changes
    },
    strictPort: true, //  Prevents random port changes
    cors: true, //  Enables CORS for all origins
    allowedHosts: true, //  Fully allows all hosts, including Ngrok
    headers: {
      "Access-Control-Allow-Origin": "*", //  Ensures CORS works across all origins
    },
  },
});
