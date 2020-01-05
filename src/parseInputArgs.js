import { identity, noop, toString } from './utils';

const defaultInputOptions = {
  onChange: identity,
  onBlur: noop,
  validate: null,
  validateOnBlur: undefined,
  touchOnChange: false,
  compare: null,
};

export function parseInputArgs(type, args) {
  let name;
  let ownValue;
  let options;
  let compareFn;
  let ownCompare;
  if (typeof args[0] === 'string' || typeof args[0] === 'number') {
    [name, ownValue] = args;
  } else {
    [{ name, value: ownValue, ...options }] = args;
  }

  ownValue = toString(ownValue);

  return {
    name,
    ownValue,
    compare: compareFn,
    hasOwnCompare: compareFn === ownCompare,
    hasOwnValue: !!ownValue,
    ...defaultInputOptions,
    ...options,
  };
}
