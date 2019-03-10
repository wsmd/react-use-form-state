import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { useFormState } from '../src';

const noop = () => {};

const InputForm = ({ onChange, name, value, type, formOptions = {} }) => {
  const [formState, input] = useFormState(null, formOptions);
  onChange(formState);
  return <input {...input[type](name, value)} required />;
};

InputForm.defaultProps = {
  onChange: noop,
};

const SelectForm = ({ onChange, name, values, type }) => {
  const [formState, input] = useFormState();
  onChange(formState);
  return (
    <select {...input[type](name)}>
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

export function renderInput(type, name, value, formOptions) {
  const onChangeMock = jest.fn();
  const { container } = render(
    <InputForm
      type={type}
      name={name}
      value={value}
      onChange={onChangeMock}
      formOptions={formOptions}
    />,
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
  const { container } = render(
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

/**
 * @todo refactor other tests to use a more generic renderer like this
 */
export function renderWithFormState(children) {
  const stateChangeHandler = jest.fn();
  const Wrapper = () => {
    const [state, inputs] = useFormState();
    stateChangeHandler(state);
    return <>{children(state, inputs)}</>;
  };
  const { container } = render(<Wrapper />);
  return {
    stateChangeHandler,
    input: container.firstChild,
    fire: (event, target) =>
      fireEvent[event](container.firstChild, target ? { target } : undefined),
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

const useRefMock = () => {
  let ref;
  return value => {
    if (!ref) ref = { current: value };
    return ref;
  };
};

export function mockReactUseRef() {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(React, 'useRef').mockImplementation(useRefMock());
  });
  afterEach(() => spy.mockRestore());
}

const useCallbackMock = callback => callback;

export function mockReactUseCallback() {
  let spy;
  beforeAll(() => {
    spy = jest.spyOn(React, 'useCallback').mockImplementation(useCallbackMock);
  });
  afterAll(() => {
    if (spy.mockRestore) spy.mockRestore();
  });
}
