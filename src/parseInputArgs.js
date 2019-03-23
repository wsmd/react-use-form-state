import { noop } from './utils';

const defaultInputOptions = {
  onChange: noop,
  onBlur: noop,
  validate: null,
  validateOnBlur: false,
};

export function parseInputArgs(args) {
  let name;
  let ownValue;
  let options;
  if (typeof args[0] === 'string' || typeof args[0] === 'number') {
    [name, ownValue] = args;
  } else {
    [{ name, value: ownValue, ...options }] = args;
  }
  return {
    name,
    ownValue,
    ...defaultInputOptions,
    ...options,
  };
}
