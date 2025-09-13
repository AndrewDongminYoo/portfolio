const _import = require('eslint-plugin-import');
const js = require('@eslint/js');
const jsxA11Y = require('eslint-plugin-jsx-a11y');
const nextPlugin = require('@next/eslint-plugin-next');
const prettier = require('eslint-config-prettier');
const importSort = require('eslint-plugin-simple-import-sort');
const globals = require('globals');
const react = require('eslint-plugin-react');
const tseslint = require('typescript-eslint');

module.exports = [
  {
    ignores: ['.next/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'import': _import,
      'jsx-a11y': jsxA11Y,
      'react': react,
      'simple-import-sort': importSort,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['next-env.d.ts'],
    rules: {
      // It's rare to need a /// triple-slash reference outside of auto-generated code...
      // https://typescript-eslint.io/rules/triple-slash-reference/
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
