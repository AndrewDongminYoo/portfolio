import type { Config } from 'jest';
import nextJest from 'next/dist/build/jest/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      enableTsDiagnostics: true,
    },
  },
  testRegex: ['__tests__/.*/index\\.(test|spec)\\.tsx?$', '__tests__/.*\\.(test|spec)\\.tsx?$'],
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  snapshotFormat: {
    indent: 4,
  },
  modulePaths: ['<rootDir>/__mocks__'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    // '^@/lib/(.*)$': '<rootDir>/__mocks__/$1',
    '^@/lib/repos': '<rootDir>/__mocks__/repos',
    '^@/(.*)$': '<rootDir>/$1',

    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    // '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    // '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
