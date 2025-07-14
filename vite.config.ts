
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ultra-minimal build to fix corruption
    target: 'es2020',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        // Single chunk to eliminate chunk loading errors
        manualChunks: () => 'index',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
