import { useCallback } from 'react';
import { toString, noop, isFunction } from './utils';

const defaultCreateId = (name, value) =>
  ['__ufs', name, value].filter(Boolean).join('__');

export function useInputId(implementation) {
  const getId = useCallback(
    (name, ownValue) => {
      let createId;
      if (!implementation) {
        createId = noop;
      } else if (isFunction(implementation)) {
        createId = implementation;
      } else {
        createId = defaultCreateId;
      }
      const value = toString(ownValue);
      return value ? createId(name, value) : createId(name);
    },
    [implementation],
  );

  const getIdProp = useCallback(
    (prop, name, value) => {
      const id = getId(name, value);
      return id === undefined ? {} : { [prop]: id };
    },
    [getId],
  );

  return { getIdProp };
}
