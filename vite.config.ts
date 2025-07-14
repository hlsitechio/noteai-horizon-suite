
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    headers: {
      // Development-friendly security headers
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    // Only enable HMR in development mode
    ...(mode === 'development' && {
      hmr: {
        port: 8080,
        clientPort: 8080,
        host: 'localhost',
        protocol: 'ws',
      },
    }),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Bundle analyzer - only in analyze mode
    process.env.ANALYZE && require('rollup-plugin-visualizer').visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable all optimization to isolate the build issue
    target: 'es2020',
    minify: false,  // Disable minification completely
    sourcemap: true,
    // Disable manual chunking completely
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 5000,
  },
  define: {
    // Remove development code in production
    __DEV__: mode === 'development',
    // Explicitly disable HMR in production
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Simplified dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  // Simplified esbuild settings
  esbuild: {
    target: 'es2020',
  },
}));
