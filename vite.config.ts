
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
    // Vite 6 optimized build configuration
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        // Keep side effects to prevent removing necessary code
        dead_code: true,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group all node_modules into vendor chunk
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            // Everything else goes to libs
            return 'libs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
    // Vite 6: Enhanced CSS handling
    cssCodeSplit: true,
    cssMinify: true,
  },
  define: {
    // Remove development code in production
    __DEV__: mode === 'development',
    // Explicitly disable HMR in production
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Vite 6: Enhanced dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge',
      'date-fns',
      'framer-motion',
    ],
    exclude: ['@vite/client', '@vite/env'],
    // Force optimization only in development
    force: mode === 'development',
  },
  // Vite 6: Improved performance settings
  esbuild: {
    target: 'es2020',
    platform: 'browser',
    format: 'esm',
  },
}));
