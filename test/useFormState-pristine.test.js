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

    expect(formState.current.pristine).toHaveProperty('name', true);
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
    expect(formState.current.pristine).toHaveProperty('name', true);
  });

  it('manually sets the pristine value of an input using setField', () => {
    const { formState } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name' })} />,
      { name: 'someval' },
    );
    expect(formState.current.pristine).toHaveProperty('name', true);
    formState.current.setField({ name: 'name', pristine: false });
    expect(formState.current.pristine).toHaveProperty('name', false);
  });

  it('marks input back as pristine', () => {
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name' })} />
    ));
    change({ value: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    change({ value: '' });
    expect(formState.current.pristine).toHaveProperty('name', true);
  });

  it('handles pristine on raw values (always false)', () => {
    let onChange;
    const { formState } = renderWithFormState(([, { raw }]) => {
      const inputProps = raw({ name: 'name' });
      ({ onChange } = inputProps);
      return <input {...inputProps} />;
    });
    expect(formState.current.pristine).toHaveProperty('name', true);
    onChange({ foo: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    onChange('');
    expect(formState.current.pristine).toHaveProperty('name', false);
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
    expect(formState.current.pristine).toHaveProperty('name', true);
  });

  it('handles pristine of checkbox inputs', () => {
    const initialState = { permission: ['1', '2', '4'] };
    const { formState, click } = renderWithFormState(
      ([, { checkbox }]) => <input {...checkbox('permission', '1')} />,
      initialState,
    );
    expect(formState.current.pristine).toHaveProperty('permission', true);
    click();
    expect(formState.current.pristine).toHaveProperty('permission', false);
    click();
    expect(formState.current.pristine).toHaveProperty('permission', true);
  });

  it.each([
    ['undefined', undefined],
    ['empty string', ''],
  ])('initial value %s is treated as pristine', (name, testValue) => {
    const initialData = { name: testValue };
    const { formState, change } = renderWithFormState(
      ([, { text }]) => <input {...text({ name: 'name' })} />,
      initialData,
    );
    change({ value: 'someval' });
    expect(formState.current.pristine).toHaveProperty('name', false);
    change({ value: '' });
    expect(formState.current.pristine).toHaveProperty('name', true);
  });

  it('reports whether the form is pristine or not', () => {
    const { change, formState } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name' })} />
    ));
    expect(formState.current.isPristine()).toBe(true);
    change({ value: 'someval' });
    expect(formState.current.isPristine()).toBe(false);
  });

  it('warns when a custom compare of "raw" is not specified', () => {
    const { change } = renderWithFormState(
      ([, { raw }]) => (
        <input {...raw({ name: 'test', validate: () => true })} />
      ),
      { test: 'foo' },
    );
    change({ value: 'test' });
    expect(console.warn.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "[useFormState]",
        "You used a raw input type for \\"test\\" without providing a custom compare method. As a result, the pristine value of this input will remain set to \\"false\\" after a change. If the form depends on the pristine values, please provide a custom compare method.",
      ]
    `);
  });
});
