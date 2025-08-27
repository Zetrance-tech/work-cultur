import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/*
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
   // host: "::",
   	host:"127.0.0.1",
	port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
*/

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    //host:true,
    port: 5001,
    proxy: {
      '/api/v1': {
        target: 'https://wc-backend.zetrance.com',
        changeOrigin: true,
        secure: true,
        // No rewrite needed since your frontend matches the backend path
      },
    },
    //allowedHosts: ['.ngrok-free.app'],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@course": path.resolve(__dirname, "./src/feature/course/src"),

       //  These two aliases ensure consistent React usage
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),

    },
  },
}));
