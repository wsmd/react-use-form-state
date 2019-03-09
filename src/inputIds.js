import { useCallback } from 'react';
import { toString } from './toString';

const ID_PREFIX = '__ufs';

const defaultIdGetter = (name, value) =>
  [ID_PREFIX, name, value].filter(part => !!part).join('__');

/**
 * @param {function|boolean} implementation
 */
export function useInputIdGetter(implementation) {
  return useCallback(
    (name, ownValue) => {
      let idGetter;
      if (typeof implementation === 'function') {
        idGetter = implementation;
      } else if (implementation === false) {
        idGetter = () => {}; // noop
      } else {
        idGetter = defaultIdGetter;
      }
      if (toString(ownValue)) {
        return idGetter(name, toString(ownValue));
      }
      return idGetter(name);
    },
    [implementation],
  );
}
