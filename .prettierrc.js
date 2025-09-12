/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  printWidth: 100,
  proseWrap: 'always',
  useTabs: false,
  bracketSameLine: true,
  bracketSpacing: true,
  jsxSingleQuote: true,
  quoteProps: 'consistent',
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss'],
};
