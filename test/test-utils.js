import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { useFormState } from '../src';
import { SELECT_MULTIPLE } from '../src/constants';

const noop = () => {};

const InputForm = ({ onChange, name, value, type }) => {
  const [formState, input] = useFormState();
  onChange(formState);
  return <input {...input[type](name, value)} required />;
};

InputForm.defaultProps = {
  onChange: noop,
};

const SelectForm = ({ onChange, name, values, type }) => {
  const isSelectMultiple = type === SELECT_MULTIPLE;
  const [formState, input] = useFormState();
  onChange(formState);
  return (
    <select {...input[type](name)} multiple={isSelectMultiple}>
      {values.map(value => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

SelectForm.defaultProps = {
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

export function renderSelect(type, name, values) {
  const onChangeMock = jest.fn();
  const { container, getByValue } = render(
    <SelectForm
      type={type}
      name={name}
      values={values}
      onChange={onChangeMock}
    />,
  );
  const select = container.firstChild;

  return {
    select,
    changeHandler: onChangeMock,
    blur: () => fireEvent.blur(select),
    change: target => fireEvent.change(select, { target }),
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
