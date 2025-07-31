
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: {
      origin: true,
      credentials: true,
    },
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
    // Ultra-minimal build to fix corruption and preload warnings
    target: 'es2020',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        // Single chunk to eliminate chunk loading errors
        manualChunks: () => 'index',
        // Prevent automatic preload injection
        experimentalMinChunkSize: 0,
      },
      // Disable preload generation at build level
      preserveEntrySignatures: 'strict',
    },
    // Completely disable modulepreload to prevent console warnings
    modulePreload: false,
    // Disable CSS code splitting to prevent CSS preloads
    cssCodeSplit: false,
    // Prevent asset inlining that might trigger preloads
    assetsInlineLimit: 0,
  },
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
