import React from 'react';
import { renderWithFormState } from './test-utils';

describe('useFormState manual updates', () => {
  it('clears a field using form.clearField', () => {
    const { formState, change } = renderWithFormState(([, input]) => (
      <input {...input.text('name')} />
    ));

    change({ value: 'waseem' });
    expect(formState.current.values.name).toEqual('waseem');

    formState.current.clearField('name');
    expect(formState.current.values.name).toEqual('');
  });

  it('clears the entire all form fields using form.clear', () => {
    const onClear = jest.fn();
    const { root, formState, change, click } = renderWithFormState(
      ([, input]) => (
        <div>
          <input {...input.text('first')} />
          <input {...input.text('last')} />
          <input {...input.checkbox('role', 'admin')} />
          <input {...input.checkbox('role', 'user')} />
        </div>
      ),
      null,
      { onClear },
    );

    change({ value: 'bruce' }, root.childNodes[0]);
    change({ value: 'wayne' }, root.childNodes[1]);
    click({}, root.childNodes[2]);
    expect(formState.current.values).toEqual({
      first: 'bruce',
      last: 'wayne',
      role: ['admin'],
    });

    formState.current.clear();
    expect(formState.current.values).toEqual({
      first: '',
      last: '',
      role: [],
    });
    expect(onClear).toHaveBeenCalled();
  });

  it('sets the value of an input programmatically using from.setField', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <input {...input.text('name')} />
    ));

    formState.current.setField('name', 'waseem');
    expect(formState.current.values.name).toBe('waseem');
  });

  it('sets the error of an input and invalidates the input programmatically using from.setFieldError', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <input {...input.text('name')} />
    ));

    formState.current.setFieldError('name', 'incorrect name');
    expect(formState.current.validity.name).toBe(false);
    expect(formState.current.errors.name).toBe('incorrect name');
  });
});
