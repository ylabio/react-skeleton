import {defineConfig} from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import path from "path";
import serverConfig from './server/config';

export default defineConfig(params => {
  return {
    root: 'src',
    build: {
      outDir: params.ssrBuild ? '../dist/server' : '../dist/client',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src'),
      }
    },
    plugins: [
      reactPlugin({
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
