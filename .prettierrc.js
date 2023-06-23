module.exports = {
  printWidth: 80,
  parser: 'flow',
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  overrides: [
    {
      files: '*.less',
      options: {
        parser: 'less',
      },
    },
  ],
};
