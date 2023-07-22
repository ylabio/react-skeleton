import typedVariables from 'dotenv-parse-variables';
import {loadEnv as loadEnvVite} from "vite";

export default function loadEnv(){
  return {
    SSR: true,
    MODE: process.env.NODE_ENV,
    PROD: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
    DEV: Boolean(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'),
    ...typedVariables(
      loadEnvVite(process.env.NODE_ENV || 'production', process.cwd(), '')
    )
  } as ImportMetaEnv;
}
