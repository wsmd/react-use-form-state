import React from 'react';
import { renderWithFormState, renderHook } from './test-utils';
import { useFormState } from '../src';

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

  it('has an errors object', () => {
    const { result } = renderHook(() => useFormState());
    const [formState] = result.current;
    expect(formState).toHaveProperty('errors', {});
  });

  it('sets a custom error when validates return non-true', () => {
    const validate = jest.fn(val => (val === 'pass' ? true : 'wrong!'));
    const { formState, change } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate })} />
    ));

    change({ value: 'fail' });
    expect(formState.current.validity).toHaveProperty('name', false);
    expect(formState.current.errors).toHaveProperty('name', 'wrong!');

    change({ value: 'pass' });
    expect(formState.current.validity).toHaveProperty('name', true);
    expect(formState.current.errors).not.toHaveProperty('name');
  });
});
