import React from 'react';
import useFormState from '../src/useFormState';

function useReducerMock(reducer, initialState = {}) {
  let state = initialState;
  const dispatch = action => {
    state = reducer(state, action);
  };
  const getState = () => state;
  return [getState(), dispatch];
}

jest.spyOn(React, 'useReducer').mockImplementation(useReducerMock);

describe('useReducerMock', () => {
  it('returns an array', () => {
    expect(useFormState()).toBeInstanceOf(Array);
    expect(useFormState()).toHaveLength(2);
  });
});

describe('formState', () => {
  it('creates formState object', () => {
    const [formState] = useFormState();
    expect(formState).toEqual({
      values: expect.any(Object),
      validity: expect.any(Object),
      touched: expect.any(Object),
    });
  });

  it('sets initial state', () => {
    const initialState = {
      name: 'Mary Poppins',
      email: 'user@example.com',
      options: ['foo', 'bar'],
    };
    const [formState] = useFormState(initialState);
    expect(formState.values).toEqual(expect.objectContaining(initialState));
  });
});

describe('input calls return appropriate props object', () => {
  it.each(['text', 'password', 'email', 'tel', 'url', 'range', 'number'])(
    'props for type "%s"',
    type => {
      const [, input] = useFormState();
      expect(input[type]('input-name')).toEqual({
        type,
        name: 'input-name',
        value: expect.any(String),
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    },
  );

  it('props for type "checkbox"', () => {
    const [, input] = useFormState();
    expect(input.checkbox('option', 'option_1')).toEqual({
      type: 'checkbox',
      name: 'option',
      value: 'option_1',
      checked: expect.any(Boolean),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  it('props for type "radio"', () => {
    const [, input] = useFormState();
    expect(input.radio('radio_name', 'radio_option')).toEqual({
      type: 'radio',
      name: 'radio_name',
      value: 'radio_option',
      checked: expect.any(Boolean),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  it('returns props for type "select"', () => {
    const [, input] = useFormState();
    expect(input.select('select_name')).toEqual({
      name: 'select_name',
      value: expect.any(String),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

describe('inputs receive default values from initial state', () => {
  it.each([
    'text',
    'password',
    'email',
    'tel',
    'url',
    'range',
    'number',
    'select',
  ])('sets initiate "value" for type "%s"', type => {
    const initialState = { 'input-name': 'input-value' };
    const [, input] = useFormState(initialState);
    expect(input[type]('input-name').value).toEqual('input-value');
  });

  it('sets initiate "checked" for type "checkbox"', () => {
    const initialState = { options: ['option_1', 'option_2'] };
    const [, input] = useFormState(initialState);
    expect(input.checkbox('options', 'option_1').checked).toEqual(true);
    expect(input.checkbox('options', 'option_2').checked).toEqual(true);
    expect(input.checkbox('options', 'option_3').checked).toEqual(false);
  });

  it('sets initiate "checked" for type "radio"', () => {
    const [, input] = useFormState({ option: 'no' });
    expect(input.radio('option', 'yes').checked).toEqual(false);
    expect(input.radio('option', 'no').checked).toEqual(true);
  });
});
