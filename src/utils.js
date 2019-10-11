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
 * Like `noop`, but passes through the first argument.
 */
export function identity(val) {
  return val;
}

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

const objectToString = value => Object.prototype.toString.call(value);

/**
 * Determines if a value is an empty collection (object, array, string, map, set)
 * @note this returns false for anything else.
 */
export function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value) || typeof value === 'string') {
    return !value.length;
  }
  if (
    objectToString(value) === '[object Map]' ||
    objectToString(value) === '[object Set]'
  ) {
    return !value.size;
  }
  if (objectToString(value) === '[object Object]') {
    return !Object.keys(value).length;
  }
  return false;
}

// We can have initial values undefined, but input makes them empty strings after edit/clear. We will consider those equal.

const withException = (original, current) =>
  (original === undefined || original === null) && current === ''
    ? true
    : undefined;

function baseIsEqual(value, other) {
  if (value === other) {
    return true;
  }

  return false;
}

function isEqualWith(value, other, customizer) {
  const result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other) : !!result;
}

export const isEqualByValue = (a, b) => isEqualWith(a, b, withException);
