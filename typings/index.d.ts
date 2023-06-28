declare module 'shallowequal';
declare module 'merge-change';
declare module '*.html' {
  const value: string;
  export default value;
}

interface ImportMeta {
  env: {
    NODE_ENV: 'production' | 'development',
    SSR: boolean,
    PROD: boolean
  }
}

interface Window {
  initialKey: string;
}

type StateSecret = {
  key: string,
  secret: string
}
