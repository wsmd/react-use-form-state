/* eslint-disable import/no-extraneous-dependencies */

import spyMatchers from 'expect/build/spyMatchers';

import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';

expect.extend({
  /**
   * Test if a mock function was called with an object containing a `values` key
   * with a value matching `valuesMatching`
   */
  toHaveBeenLastCalledWithValues(changeHandler, valuesMatching) {
    const valuesMatcher = expect.objectContaining({
      values: valuesMatching,
    });
    return spyMatchers.toHaveBeenLastCalledWith(changeHandler, valuesMatcher);
  },
});
