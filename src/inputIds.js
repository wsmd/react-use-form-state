import { useCallback } from 'react';
import { toString } from './toString';

const ID_PREFIX = '__ufs';

/**
 * @param {function|boolean} implementation
 */
export function useInputIdGetter(implementation) {
  return useCallback(
    (name, value) => {
      const idGetter = implementation || (() => {});
      return idGetter(name, toString(value));
    },
    [implementation],
  );
}

export const defaultIdGetter = (name, value) =>
  [ID_PREFIX, name, value].filter(part => part !== '').join('__');
