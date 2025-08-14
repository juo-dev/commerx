module.exports = {
  semi: false,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  bracketSpacing: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  overrides: [
    {
      files: '*.sol',
      options: {
        semi: true,
        singleQuote: false,
        tabWidth: 4,
      },
    },
  ],
}
