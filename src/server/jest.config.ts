import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/server.ts', '!src/lib/prisma.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          esModuleInterop: true,
        },
      },
    ],
  },

  testMatch: ['**/__tests__/**/*.test.[jt]s', '**/__tests__/**/*.spec.[jt]s'],

  // Run sequentially — tests share a single SQLite file
  maxWorkers: 1,
};

export default config;
