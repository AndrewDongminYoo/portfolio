const { defineConfig, globalIgnores } = require('eslint/config');
const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');
const { FlatCompat } = require('@eslint/eslintrc');
const _import = require('eslint-plugin-import');
const globals = require('globals');
const js = require('@eslint/js');
const jsxA11Y = require('eslint-plugin-jsx-a11y');
const preferArrow = require('eslint-plugin-prefer-arrow');
const prettier = require('eslint-config-prettier');
const react = require('eslint-plugin-react');
const tsParser = require('@typescript-eslint/parser');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  globalIgnores([
    './.prettierrc.js',
    './*.config.js',
    './*.setup.js',
    '**/.build',
    '**/.github',
    '**/.next',
    '**/.vscode',
    '**/node_modules',
    '**/out',
  ]),
  prettier,
  {
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:@next/next/recommended',
        'prettier',
      ),
    ),

    plugins: {
      'import': fixupPluginRules(_import),
      'react': fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      'prefer-arrow': preferArrow,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: true,
        allowImportExportEverywhere: true,

        babelOptions: {
          caller: {
            supportsTopLevelAwait: true,
          },

          presets: ['next/babel'],
        },

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'next': {
        rootDir: '.',
      },

      'react': {
        version: 'detect',
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
      },

      'import/resolver': {
        node: true,
        typescript: true,
      },
    },

    rules: {
      'complexity': [
        'error',
        {
          max: 10,
        },
      ],

      'eqeqeq': ['error', 'allow-null'],

      'id-denylist': [
        'error',
        'any',
        'Number',
        'number',
        'String',
        'string',
        'Boolean',
        'boolean',
        'Undefined',
        'undefined',
      ],

      'max-classes-per-file': ['error', 1],
      'new-parens': 'warn',
      'no-case-declarations': 'warn',

      'no-console': [
        'warn',
        {
          allow: ['debug', 'error'],
        },
      ],

      'no-dupe-args': 'warn',
      'no-dupe-class-members': 'warn',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-var': 'error',
      'no-with': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': 'warn',

      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],

      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],

      'use-isnan': 'warn',
      '@next/next/google-font-display': 'error',
      '@next/next/google-font-preconnect': 'error',
      '@next/next/inline-script-id': 'error',
      '@next/next/next-script-for-ga': 'error',
      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-typos': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',
      '@typescript-eslint/no-var-requires': 'off',

      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
        },
      ],

      'import/default': 'error',
      'import/export': 'error',
      'import/named': 'off',
      'import/namespace': 'error',
      'import/no-anonymous-default-export': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-unresolved': 'off',

      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],

      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          allowStandaloneDeclarations: true,
          classPropertiesAllowed: true,
          disallowPrototype: true,
          singleReturnOnly: true,
        },
      ],

      'react/jsx-no-target-blank': 'error',
      'react/no-unescaped-entities': 'error',

      'react/no-unknown-property': [
        'error',
        {
          ignore: ['jsx'],
        },
      ],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.ts?(x)'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
  },
]);
