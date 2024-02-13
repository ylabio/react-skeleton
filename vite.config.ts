import {defineConfig, loadEnv} from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import path from "path";
import typedVariables from 'dotenv-parse-variables';
import proxyConfig from "./proxy.config";

export default defineConfig(params => {
  const env = typedVariables(loadEnv(params.mode, process.cwd(), '')) as ImportMetaEnv;
  return {
    root: 'src',
    base: env.BASE_URL,
    build: {
      outDir: params.isSsrBuild ? '../dist/server' : '../dist/client',
      emptyOutDir: true,
      cssCodeSplit: false
    },
    ssr: {
      // Названия пакетов, которые нужно добавить в сборку при SSR вместо импорта из node_modules
      noExternal: [
        'react-helmet-async'
      ]
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
      checker({
        // e.g. use TypeScript check
        typescript: true,
        overlay: false
      }),
    ],
    server: {
      port: env.PORT,
      proxy: proxyConfig(env),
      hmr: true
    },
    preview: {
      port: env.PORT,
    },
  };
});
