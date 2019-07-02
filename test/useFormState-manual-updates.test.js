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

  it('sets the values of multiple inputs using formState.setFields', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <>
        <input {...input.text('firstName')} />
        <input {...input.text('lastName')} required />
        <input {...input.number('age')} />
      </>
    ));

    const values1 = {
      firstName: "John",
      lastName: "Doe",
      age: 33
    };

    formState.current.setFields(values1);

    expect(formState.current.values).toMatchObject(values1);
    expect(Object.values(formState.current.validity)).toMatchObject([true, true, true]);
    expect(Object.values(formState.current.touched)).toMatchObject([false, false, false]);
    expect(Object.values(formState.current.errors)).toMatchObject([undefined, undefined, undefined]);

    const values2 = {
      firstName: "Barry",
      lastName: ""
    };

    formState.current.setFields(values2);

    const expected2 = Object.assign({}, values1, values2);
    expect(formState.current.values).toMatchObject(expected2);
  });

  it('sets validity when provided in options of formState.setFields', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <>
        <input {...input.text('firstName')} />
        <input {...input.text('lastName')} required />
      </>
    ));

    const values = {
      firstName: "John",
      lastName: "Doe"
    };

    formState.current.setFields(values, {
      validity: true
    });
    expect(formState.current.values).toMatchObject(values);
    expect(formState.current.validity).toMatchObject({
      firstName: true,
      lastName: true
    });

    formState.current.setFields({firstName: "test", lastName: "foo"}, {
      validity: false
    });
    expect(formState.current.validity).toMatchObject({
      firstName: false,
      lastName: false
    });

    formState.current.setFields(values, {
      validity: {
        firstName: true,
        lastName: false
      }
    });
    expect(Object.values(formState.current.validity)).toMatchObject([true, false]);
  });

  it('sets touched when provided in options of formState.setFields', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <>
        <input {...input.text('firstName')} />
        <input {...input.text('lastName')} required />
      </>
    ));

    const values = {
      firstName: "John",
      lastName: "Doe"
    };

    formState.current.setFields(values, {
      touched: true
    });
    expect(formState.current.values).toMatchObject(values);
    expect(formState.current.touched).toMatchObject({
      firstName: true,
      lastName: true
    });

    formState.current.setFields(values, {
      touched: false
    });
    expect(formState.current.touched).toMatchObject({
      firstName: false,
      lastName: false
    });

    formState.current.setFields(values, {
      touched: {
        firstName: true,
        lastName: false
      }
    });
    expect(formState.current.touched).toMatchObject({
      firstName: true,
      lastName: false
    });
  });

  it('sets the errors of the specified fields when provided in options of formState.setFields', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <>
        <input {...input.text('firstName')} />
        <input {...input.text('lastName')} required />
      </>
    ));

    const values = {
      firstName: "John",
      lastName: ""
    };
    const errors = {
      lastName: "This field cannot be empty"
    };

    formState.current.setFields(values, {errors});

    expect(formState.current.errors).toMatchObject(errors);
    expect(formState.current.validity).toMatchObject({
      lastName: false
    });
  });

  it ('automatically clears errors when marking fields as valid via formState.setFields', () => {
    const { formState } = renderWithFormState(([, input]) => (
      <>
        <input {...input.text('firstName')} />
      </>
    ));

    const values = {
      firstName: "#$%^&"
    };
    const errors = {
      firstName: "That's not a name"
    };
    formState.current.setFields(values, {errors});
    expect(formState.current.values).toMatchObject(values);
    expect(formState.current.errors).toMatchObject(errors);

    const newValues = {
      firstName: "John"
    };
    const newValidity = {
      firstName: true
    };
    formState.current.setFields(newValues, {validity: newValidity});

    expect(formState.current.values).toMatchObject(newValues);
    expect(formState.current.errors).toMatchObject({firstName: undefined});
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
