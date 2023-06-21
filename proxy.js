export default {
  '/api/**': {
    target: 'http://example.front.ylab.io',
    secure: false,
    changeOrigin: true,
  },
}
