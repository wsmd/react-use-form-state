import React from 'react';
import { renderWithFormState, renderHook } from './test-utils';
import { useFormState } from '../src';

describe('useFormState pristine', () => {
  it('has an pristine object', () => {
    const { result } = renderHook(() => useFormState());
    const [formState] = result.current;
    expect(formState).toHaveProperty('pristine', {});
  });

  it('marks input as not pristine', () => {
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name' })} />
    ));
    change({ value: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
  });

  it('marks input as not pristine when have default value', () => {
    const initialData = { name: 'someval' };

    const { change, formState } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name' })} />,
      initialData,
    );

    change({ value: 'someotherval' });

    expect(formState.current.pristine).toHaveProperty('name', false);
    change({ value: 'someval' });

    expect(formState.current.pristine).not.toHaveProperty('name');
  });

  it('reset marks input as pristine when have default value', () => {
    const initialData = { name: 'someval' };

    const { change, formState } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name' })} />,
      initialData,
    );
    change({ value: 'someotherval' });
    expect(formState.current.pristine).toHaveProperty('name', false);

    formState.current.resetField('name');
    expect(formState.current.pristine).not.toHaveProperty('name');
  });

  it('marks input back as pristine', () => {
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name' })} />
    ));
    change({ value: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    change({ value: '' });
    expect(formState.current.pristine).not.toHaveProperty('name');
  });

  it('handles pristine on raw values', () => {
    let onChange;
    const { formState } = renderWithFormState(([, { raw }]) => {
      const inputProps = raw({ name: 'name' });
      ({ onChange } = inputProps);
      return <input {...inputProps} />;
    });

    onChange({ foo: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    onChange('');
    expect(formState.current.pristine).not.toHaveProperty('name');
  });

  it('calls options.compare when an input changes', () => {
    const compareHandler = jest.fn();
    const { change } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', compare: compareHandler })} />
    ));
    change({ value: 'someval' });
    expect(compareHandler).toHaveBeenCalledTimes(1);
  });

  it('handles pristine on raw  default value', () => {
    const initialData = { name: { foo: 'someval' } };
    const isEqual = (a, b) => a.foo === b.foo;
    let onChange;
    const { formState } = renderWithFormState(([, { raw }]) => {
      const inputProps = raw({
        name: 'name',
        compare: (initialValue, value) => isEqual(initialValue, value),
      });
      ({ onChange } = inputProps);
      return <input {...inputProps} />;
    }, initialData);

    onChange({ foo: 'otherval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    onChange({ foo: 'someval' });
    expect(formState.current.pristine).not.toHaveProperty('name');
  });

  it.each([
    ['undefined', undefined],
    ['empty string', ''],
    ['null', null],
  ])('initial value %s is treated as pristine', (name, testValue) => {
    const initialData = { name: testValue };
    const { formState, change } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name' })} />,
      initialData,
    );
    change({ value: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name');
    change({ value: '' });
    expect(formState.current.pristine).not.toHaveProperty('name');
  });
});
