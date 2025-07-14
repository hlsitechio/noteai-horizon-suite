
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
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          vendor: ['react', 'react-dom'],
          // UI components
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-select', '@radix-ui/react-popover'],
          // Utilities and helpers
          utils: ['clsx', 'tailwind-merge', 'date-fns', 'lodash.debounce', 'lodash.throttle'],
          // Rich text editor
          editor: ['slate', 'slate-react', 'slate-history', 'slate-dom'],
          // Monitoring and analytics
          monitoring: ['@hyperdx/browser'],
          // Backend services
          supabase: ['@supabase/supabase-js'],
          // Charts and visualization
          charts: ['recharts'],
          // Animation and motion
          animation: ['framer-motion'],
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
    // Ensure HMR is completely disabled in production
    'import.meta.hot': mode === 'development' ? 'import.meta.hot' : 'false',
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
    force: mode === 'development',
  },
  // Vite 6: Improved performance settings
  esbuild: {
    target: 'esnext',
    platform: 'browser',
    format: 'esm',
  },
}));
