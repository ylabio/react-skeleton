module.exports = {
  printWidth: 100,
  endOfLine: 'lf',
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  bracketSpacing: true,
  overrides: [
    {
      files: '*.less',
      options: {
        parser: 'less',
      },
    },
  ],
};
