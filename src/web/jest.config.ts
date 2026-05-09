import type { Config } from 'jest';

const config: Config = {
  // Ambiente que simula o DOM do browser
  testEnvironment: 'jsdom',

  // Quais arquivos são testes unitários
  testMatch: ['**/tests/unit/**/*.test.tsx', '**/tests/unit/**/*.test.ts'],

  // Roda o setup após o Jest ser inicializado (importa jest-dom matchers)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Transforma TS/TSX usando ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          paths: {
            '@/*': ['./src/*'],
          },
        },
      },
    ],
  },

  // Resolve alias @/ para src/
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Arquivos estáticos (imagens e estilos) viram mocks no ambiente de teste
    '\\.(css|scss|sass|png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/tests/unit/__mocks__/fileMock.ts',
  },
};

export default config;
