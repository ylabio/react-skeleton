import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import reactPlugin from '@vitejs/plugin-react';
import path from "path";
import serverConfig from './server/config';

export default defineConfig(params => {
  return {
    root: 'src',
    build: {
      // Relative to the root
      outDir: params.ssrBuild ? '../dist/server' : '../dist/client',
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
  };
});
