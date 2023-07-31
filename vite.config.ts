import {defineConfig, loadEnv} from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import path from "path";
import typedVariables from 'dotenv-parse-variables';

export default defineConfig(params => {
  const env = typedVariables(loadEnv(params.mode, process.cwd(), '')) as Env;
  return {
    root: 'src',
    base: env.BASE_URL,
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
      port: env.PORT,
      proxy: {
        [env.API_PATH]: {
          target: env.API_URL,
          secure: false,
          changeOrigin: true,
          timeout: 2000
        }
      },
      hmr: true
    },
    preview: {
      port: env.PORT,
    },
  };
});
