/* eslint-disable import/no-extraneous-dependencies */

import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';

/**
 * Mocking calls to console.warn to test against warnings and errors logged
 * in the development environment.
 */
let consoleSpy;
beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  global.__DEV__ = 'development';
});
afterEach(() => {
  consoleSpy.mockRestore();
  global.__DEV__ = process.env.NODE_ENV;
});
