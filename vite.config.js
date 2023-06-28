import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import reactPlugin from '@vitejs/plugin-react';
import path from "path";
import serverConfig from './ssr/config.js';

export default defineConfig({
  root: 'src',
  build: {
    // Relative to the root
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: 'App'
        },
      },
    }),
    reactPlugin({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
  server: {
    port: serverConfig.server.port,
    proxy: serverConfig.proxy.routes,
    hmr: true
  }
});
