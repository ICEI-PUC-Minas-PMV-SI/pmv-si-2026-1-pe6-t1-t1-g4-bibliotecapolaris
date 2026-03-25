/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/server.ts'],

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  moduleFileExtensions: ['js', 'ts', 'json'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          module: 'commonjs',
        },
      },
    ],
  },
};

export default config;
