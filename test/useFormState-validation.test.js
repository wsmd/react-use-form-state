import React from 'react';
import { renderWithFormState, renderHook } from './test-utils';
import { useFormState } from '../src';

const INPUT_CHANGE_EVENT = expect.any(Object);

describe('passing a custom input validate function', () => {
  it('calls input validate function', () => {
    const validate = jest.fn(() => false);
    const { change, blur, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate })} />
    ));

    expect(validate).not.toHaveBeenCalled();
    change({ value: 'test' });
    expect(validate).toHaveBeenCalledWith(
      'test',
      { name: 'test' },
      INPUT_CHANGE_EVENT,
    );

    // making sure we're ignoring HTML5 validity on onBlur (input will be set as valid otherwise)
    blur();
    expect(formState.current.validity).toHaveProperty('name', false);
  });

  it('calls input validate function on blur with validateOnBlur', () => {
    const validate = jest.fn(() => false);
    const { change, blur } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate, validateOnBlur: true })} />
    ));

    change({ value: 'test' });
    expect(validate).not.toHaveBeenCalled();
    blur();
    expect(validate).toHaveBeenCalledWith(
      'test',
      { name: 'test' },
      INPUT_CHANGE_EVENT,
    );
  });

  it('calls input validate function on blur with validateOnBlur on formState', () => {
    const validate = jest.fn(() => false);
    const { change, blur } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name', validate })} />,
      {},
      { validateOnBlur: true },
    );

    change({ value: 'test' });
    expect(validate).not.toHaveBeenCalled();
    blur();
    expect(validate).toHaveBeenCalledWith(
      'test',
      { name: 'test' },
      INPUT_CHANGE_EVENT,
    );
  });

  it('marks input as valid', () => {
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input
        {...text({
          name: 'name',
          validate(value) {
            if (value === 'fail') return false;
            if (value === 'pass') return true;
          },
        })}
      />
    ));
    change({ value: 'pass' });
    expect(formState.current.validity).toHaveProperty('name', true);
    change({ value: 'other' });
    expect(formState.current.validity).toHaveProperty('name', true);
  });

  it('marks input as invalid', () => {
    const validate = value => value !== 'fail';
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate })} />
    ));
    change({ value: 'fail' });
    expect(formState.current.validity).toHaveProperty('name', false);
    expect(formState.current.errors).not.toHaveProperty('name', false);
    change({ value: 'pass' });
    expect(formState.current.validity).toHaveProperty('name', true);
  });

  it('has an errors object', () => {
    const { result } = renderHook(() => useFormState());
    const [formState] = result.current;
    expect(formState).toHaveProperty('errors', {});
  });

  it('sets a custom error when validates return an error', () => {
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

  it('handles validation of raw values', () => {
    const validate = jest.fn(val => (val.foo === 'pass' ? true : 'wrong!'));
    let onChange;
    const { formState } = renderWithFormState(([, { raw }]) => {
      const inputProps = raw({ name: 'name', validate });
      ({ onChange } = inputProps);
      return <input {...inputProps} />;
    });

    onChange({ foo: 'fail' });
    expect(formState.current.validity).toHaveProperty('name', false);
    expect(formState.current.errors).toHaveProperty('name', 'wrong!');

    onChange({ foo: 'pass' });
    expect(formState.current.validity).toHaveProperty('name', true);
    expect(formState.current.errors).not.toHaveProperty('name');
  });

  it('handles validation of raw values on blur', () => {
    const validate = jest.fn(val =>
      val && val.foo === 'pass' ? true : 'wrong!',
    );
    let onChange;
    let onBlur;
    const { formState } = renderWithFormState(([, { raw }]) => {
      const inputProps = raw({ name: 'name', validate });
      ({ onChange, onBlur } = inputProps);
      return <input {...inputProps} />;
    });

    onChange({ foo: 'fail' });
    onBlur();
    expect(formState.current.validity).toHaveProperty('name', false);
    expect(formState.current.errors).toHaveProperty('name', 'wrong!');

    onChange({ foo: 'pass' });
    onBlur();
    expect(formState.current.validity).toHaveProperty('name', true);
    expect(formState.current.errors).not.toHaveProperty('name');
  });

  it.each([
    ['empty array', []],
    ['empty object', {}],
    ['empty Set', new Set()],
    ['empty Map', new Map()],
    ['empty string', ''],
    ['boolean (false)', false],
    ['null', null],
  ])('does not treat %s as validation error', (name, testValue) => {
    const { formState, change } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate: () => testValue })} />
    ));
    change({ value: 'a' });
    expect(formState.current.errors).not.toHaveProperty('name');
  });

  it.each([
    ['array', ['error']],
    ['object', { error: 'error' }],
    ['Set', new Set(['error'])],
    ['Map', new Map([['error', 'error']])],
    ['string', 'error'],
    ['number', 0],
  ])('treats %s as validation error', (name, testValue) => {
    const { formState, change } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', validate: () => testValue })} />
    ));
    change({ value: 'a' });
    expect(formState.current.errors).toHaveProperty('name', testValue);
  });
});
