/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['tests'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
};
