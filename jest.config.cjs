let pathsToModuleNameMapper;
({ pathsToModuleNameMapper } = require('ts-jest'));
let compilerOptions;
({ compilerOptions } = require('./tsconfig.json'));

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.spec.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
