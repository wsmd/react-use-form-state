import React from 'react';
import { renderWithFormState } from './test-utils';

describe('passing a custom input validate function', () => {
  it('calls custom input validate function', () => {
    const validate = jest.fn(value => value === 'shall pass');
    const { change, blur, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate })} />
    ));

    change({ value: 'shall not pass' });
    expect(formState.current).toEqual(
      expect.objectContaining({ validity: { name: false } }),
    );

    // making sure we're ignoring HTML5 validity on onBlur
    blur();
    expect(formState.current).toEqual(
      expect.objectContaining({ validity: { name: false } }),
    );

    change({ value: 'shall pass' });
    expect(formState.current).toEqual(
      expect.objectContaining({
        validity: { name: true },
        touched: { name: true },
      }),
    );
  });

  it('calls custom input validate function on blur', () => {
    const validate = jest.fn(value => value === 'shall pass');
    const { formState, change, blur } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate, validateOnBlur: true })} />
    ));

    change({ value: 'shall not pass' });
    expect(validate).not.toHaveBeenCalled();
    expect(formState.current).toEqual(
      expect.objectContaining({ validity: {} }),
    );

    blur();
    expect(validate).toHaveBeenCalledWith(
      'shall not pass',
      { name: 'shall not pass' },
      expect.any(Object),
    );
    expect(formState.current).toEqual(
      expect.objectContaining({ validity: { name: false } }),
    );

    change({ value: 'shall pass' });
    blur();
    expect(validate).toHaveBeenCalledWith(
      'shall pass',
      { name: 'shall pass' },
      expect.any(Object),
    );
    expect(formState.current).toEqual(
      expect.objectContaining({ validity: { name: true } }),
    );
  });
});
