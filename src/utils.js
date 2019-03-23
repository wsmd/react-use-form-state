/**
 * Returns a function that can be called with an object. The return value of the
 * new function is a copy of the object excluding the key passed initially.
 */
export function omit(key) {
  return object => {
    const { [key]: toRemove, ...rest } = object;
    return rest;
  };
}

/**
 * An empty function. It does nothing.
 */
export function noop() {}

/**
 * Cast non-string values to a string, with the exception of functions, symbols,
 * and undefined.
 */
export function toString(value) {
  switch (typeof value) {
    case 'function':
    case 'symbol':
    case 'undefined':
      return '';
    default:
      return '' + value; // eslint-disable-line prefer-template
  }
}

export function isFunction(value) {
  return typeof value === 'function';
}
