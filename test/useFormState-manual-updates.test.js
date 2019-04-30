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

  it('resets a field to its initial value on form.resetField', () => {
    const { formState, change } = renderWithFormState(
      ([, input]) => <input {...input.text('name')} />,
      { name: 'waseem' },
    );

    change({ value: 'cool' });
    expect(formState.current.values.name).toEqual('cool');

    formState.current.resetField('name');
    expect(formState.current.values.name).toEqual('waseem');
  });

  it('clears the entire all form fields using form.clear', () => {
    const { root, formState, change, click } = renderWithFormState(
      ([, input]) => (
        <div>
          <input {...input.text('first')} />
          <input {...input.text('last')} />
          <input {...input.checkbox('role', 'admin')} />
          <input {...input.checkbox('role', 'user')} />
        </div>
      ),
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
  });

  it('resets the entire all form fields to their initial values using form.reset', () => {
    const initialState = {
      first: 'waseem',
      last: 'dahman',
      role: ['user'],
    };

    const { root, formState, change, click } = renderWithFormState(
      ([, input]) => (
        <div>
          <input {...input.text('first')} />
          <input {...input.text('last')} />
          <input {...input.checkbox('role', 'admin')} />
          <input {...input.checkbox('role', 'user')} />
        </div>
      ),
      initialState,
    );

    change({ value: 'bruce' }, root.childNodes[0]);
    change({ value: 'wayne' }, root.childNodes[1]);
    click({}, root.childNodes[3]);
    expect(formState.current.values).toEqual({
      first: 'bruce',
      last: 'wayne',
      role: [],
    });

    formState.current.reset();
    expect(formState.current.values).toEqual(initialState);
  });

  it('sets the value of an input programmatically using from.setField', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <input {...input.text('name')} />
    ));

    formState.current.setField('name', 'waseem');
    expect(formState.current.values.name).toBe('waseem');
  });
});
