import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import testcasePlugin from './plugins/vite-plugin-testcase';

// https://vitejs.dev/config/
const baseUrl = 'https://llm-rgb.babel.run';
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@data': path.resolve(__dirname, './src/data'),
      '@models': path.resolve(__dirname, './src/models'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@testcases': path.resolve(__dirname, '../testcases'),
    },
  },
  plugins: [react(), testcasePlugin()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return `${assetInfo.name}`;
        },
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
      },
    },
  },
  server: {
    proxy: {
      '/run-test': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/get-test-result-score': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/get-test-stats': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/get-test-result-raw': {
        target: baseUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
