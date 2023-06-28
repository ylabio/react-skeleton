export default {
  // Формат для прокси в vite
  '/api': {
    target: 'http://example.front.ylab.io',
    secure: false,
    changeOrigin: true,
  },
};
