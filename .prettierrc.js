/**
 * @see https://prettier.io/docs/configuration
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions}
 */
module.exports = {
  printWidth: 100,
  proseWrap: 'preserve',
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
