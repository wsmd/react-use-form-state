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
