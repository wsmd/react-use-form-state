import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { useFormState } from '../src';

const noop = () => {};

const InputForm = ({ onChange, name, value, type }) => {
  const [formState, input] = useFormState();
  onChange(formState);
  return <input {...input[type](name, value)} required />;
};

InputForm.defaultProps = {
  onChange: noop,
};

export function renderInput(type, name, value) {
  const onChangeMock = jest.fn();
  const { container } = render(
    <InputForm type={type} name={name} value={value} onChange={onChangeMock} />,
  );
  const input = container.firstChild;
  return {
    input,
    changeHandler: onChangeMock,
    blur: () => fireEvent.blur(input),
    change: target => fireEvent.change(input, { target }),
    click: () => fireEvent.click(input),
  };
}

const useReducerMock = (reducer, initialState = {}) => [initialState, noop];

export function mockReactUseReducer() {
  let spy;
  beforeAll(() => {
    spy = jest.spyOn(React, 'useReducer').mockImplementation(useReducerMock);
  });
  afterAll(() => {
    if (spy.mockRestore) spy.mockRestore();
  });
}
