/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testMatch: ['**/src/**/__tests__/**/*.test.spec.ts?(x)', '**/src/**/?(*.)+(spec|test).ts?(x)'],
};

module.exports = config;
