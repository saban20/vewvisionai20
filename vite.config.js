import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Include .js files with JSX
    include: "**/*.{jsx,js}",
  })],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
}); 