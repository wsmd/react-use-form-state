import React from 'react';
import { useFormState } from '../src';
import {
  mockReactUseCallback,
  mockReactUseReducer,
  mockReactUseRef,
  renderInput,
  renderSelect,
  renderWithFormState,
} from './test-utils';

mockReactUseCallback();
mockReactUseRef();

const textLikeInputs = ['text', 'email', 'password', 'search', 'tel', 'url'];
const timeInputs = ['date', 'month', 'time', 'week'];
const numericInputs = ['number', 'range'];

describe('useFormState API', () => {
  mockReactUseReducer();

  it('returns an array matching [formState, input]', () => {
    const result = useFormState();
    expect(result).toEqual([
      { values: {}, validity: {}, touched: {} },
      expect.any(Object),
    ]);
  });

  it.each([
    ...textLikeInputs,
    ...numericInputs,
    ...timeInputs,
    'checkbox',
    'color',
    'radio',
    'select',
    'selectMultiple',
    'textarea',
    'label',
  ])('has a method for type "%s"', type => {
    const result = useFormState();
    expect(result[1][type]).toBeInstanceOf(Function);
  });

  it('sets initial/default state for inputs', () => {
    const initialState = {
      name: 'Mary Poppins',
      email: 'user@example.com',
      options: ['foo', 'bar'],
    };
    const [formState] = useFormState(initialState);
    expect(formState.values).toEqual(expect.objectContaining(initialState));
  });
});

describe('useFormState options', () => {
  it('calls options.onChange when an input changes', () => {
    const changeHandler = jest.fn();
    const { change } = renderInput('text', 'username', undefined, {
      onChange: changeHandler,
    });
    change({ value: 'w' });
    expect(changeHandler).toHaveBeenCalledWith(
      expect.any(Object), // SyntheticEvent
      expect.objectContaining({ username: '' }),
      expect.objectContaining({ username: 'w' }),
    );
  });

  it('calls options.onBlur when an input changes', () => {
    const blurHandler = jest.fn();
    const { blur } = renderInput('text', 'username', undefined, {
      onBlur: blurHandler,
    });
    blur();
    expect(blurHandler).toHaveBeenCalledWith(expect.any(Object));
    blur();
    expect(blurHandler).toHaveBeenCalledTimes(2);
  });

  it('calls options.onTouched when an input changes', () => {
    const touchedHandler = jest.fn();
    const { blur } = renderInput('text', 'username', undefined, {
      onTouched: touchedHandler,
    });
    blur();
    expect(touchedHandler).toHaveBeenCalled();
    blur();
    expect(touchedHandler).toHaveBeenCalledTimes(1);
  });
});

describe('input type methods return correct props object', () => {
  mockReactUseReducer();

  /**
   * Must return type and value
   */
  it.each([...textLikeInputs, ...numericInputs, ...timeInputs, 'color'])(
    'returns props for type "%s"',
    type => {
      const [, input] = useFormState();
      expect(input[type]('input-name')).toEqual({
        type,
        name: 'input-name',
        value: '',
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    },
  );

  /**
   * Checkbox must have a type, value, and checked
   */
  it('returns props for type "checkbox"', () => {
    const [, input] = useFormState();
    expect(input.checkbox('option', 'option_1')).toEqual({
      type: 'checkbox',
      name: 'option',
      value: 'option_1',
      checked: false,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  /**
   * Checkbox must have a type, value, and checked
   */
  it('returns props for type "checkbox" without a value', () => {
    const [, input] = useFormState();
    expect(input.checkbox('option')).toEqual({
      type: 'checkbox',
      name: 'option',
      checked: false,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
      value: '',
    });
  });

  /**
   * Radio must have a type, value, and checked
   */
  it('returns props for type "radio"', () => {
    const [, input] = useFormState();
    expect(input.radio('radio_name', 'radio_option')).toEqual({
      type: 'radio',
      name: 'radio_name',
      value: 'radio_option',
      checked: false,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  /**
   * Stringify non-string ownValue of checkbox and radio
   */
  it.each`
    type          | ownValue      | expected
    ${'array'}    | ${[1, 2]}     | ${'1,2'}
    ${'boolean'}  | ${false}      | ${'false'}
    ${'number'}   | ${1}          | ${'1'}
    ${'object'}   | ${{}}         | ${'[object Object]'}
    ${'function'} | ${() => {}}   | ${''}
    ${'Symbol'}   | ${Symbol('')} | ${''}
  `(
    'stringify ownValue of type $type for checkbox and radio',
    ({ ownValue, expected }) => {
      const [, input] = useFormState();
      expect(input.checkbox('option1', ownValue).value).toEqual(expected);
      expect(input.radio('option2', ownValue).value).toEqual(expected);
    },
  );

  /**
   * Select doesn't need a type
   */
  it('returns props for type "select"', () => {
    const [, input] = useFormState();
    expect(input.select('select_name')).toEqual({
      name: 'select_name',
      value: expect.any(String),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  /**
   * SelectMultiple doesn't need a type but must have a multiple
   */
  it('returns props for type "selectMultiple"', () => {
    const [, input] = useFormState();
    expect(input.selectMultiple('select_name')).toEqual({
      name: 'select_name',
      multiple: true,
      value: expect.any(String),
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  /**
   * Textarea doesn't need a type
   */
  it('returns props for type "textarea"', () => {
    const [, input] = useFormState();
    expect(input.textarea('name')).toEqual({
      name: 'name',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

describe('passing an object to input type method', () => {
  mockReactUseReducer();

  it('returns correct props for type "text"', () => {
    const [, input] = useFormState({ username: 'wsmd' });
    expect(input.text({ name: 'username' })).toEqual({
      type: 'text',
      name: 'username',
      value: 'wsmd',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  it('returns correct props for type "checkbox"', () => {
    const [, input] = useFormState();
    expect(input.checkbox({ name: 'options', value: 0 })).toEqual({
      type: 'checkbox',
      checked: false,
      name: 'options',
      value: '0',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

describe('passing an object to input type method with callbacks', () => {
  it('calls input onChange', () => {
    const onChange = jest.fn();
    const { fire } = renderWithFormState((state, { text }) => (
      <input {...text({ name: 'name', onChange })} />
    ));
    fire('change', { value: 'test' });
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls input onBlur', () => {
    const onBlur = jest.fn();
    const { fire } = renderWithFormState((state, { text }) => (
      <input {...text({ name: 'name', onBlur })} />
    ));
    fire('blur');
    expect(onBlur).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls custom input validate function', () => {
    const validate = jest.fn(value => value === 'shall pass');
    const { fire, stateChangeHandler } = renderWithFormState(
      (state, { text }) => <input {...text({ name: 'name', validate })} />,
    );

    fire('change', { value: 'shall not pass' });
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({ validity: { name: false } }),
    );

    // making sure we're ignoring HTML5 validity on onBlur
    fire('blur');
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({ validity: { name: false } }),
    );

    fire('change', { value: 'shall pass' });
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        validity: { name: true },
        touched: { name: true },
      }),
    );
  });

  it('calls custom input validate function on blur', () => {
    const validate = jest.fn(value => value === 'shall pass');
    const { stateChangeHandler, fire, input } = renderWithFormState(
      (state, { text }) => (
        <input {...text({ name: 'name', validate, validateOnBlur: true })} />
      ),
    );

    fire('change', { value: 'shall not pass' });
    expect(validate).not.toHaveBeenCalled();
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({ validity: {} }),
    );

    fire('blur');
    expect(validate).toHaveBeenCalledWith('shall not pass', {
      name: 'shall not pass',
    }, expect.any(Object));
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({ validity: { name: false } }),
    );

    fire('change', { value: 'shall pass' });
    fire('blur');
    expect(validate).toHaveBeenCalledWith('shall pass', {
      name: 'shall pass',
    }, expect.any(Object));
    expect(stateChangeHandler).toHaveBeenLastCalledWith(
      expect.objectContaining({ validity: { name: true } }),
    );
  });
});

describe('inputs receive default values from initial state', () => {
  mockReactUseReducer();

  it.each([...textLikeInputs, ...timeInputs, 'color', 'textarea', 'select'])(
    'sets initial "value" for type "%s"',
    type => {
      const initialState = { 'input-name': 'input-value' };
      const [, input] = useFormState(initialState);
      expect(input[type]('input-name').value).toEqual('input-value');
    },
  );

  it.each(numericInputs)('sets initial "value" for type "%s"', type => {
    const initialState = { 'input-name': '101' };
    const [, input] = useFormState(initialState);
    expect(input[type]('input-name').value).toEqual('101');
  });

  it('sets initial "value" for type "selectMultiple"', () => {
    const value = ['option_1', 'option_2'];
    const initialState = { multiple: value };
    const [, input] = useFormState(initialState);
    expect(input.selectMultiple('multiple').value).toEqual(value);
  });

  it('sets initial "checked" for type "checkbox"', () => {
    const initialState = { options: ['option_1', 'option_2'] };
    const [, input] = useFormState(initialState);
    expect(input.checkbox('options', 'option_1').checked).toEqual(true);
    expect(input.checkbox('options', 'option_2').checked).toEqual(true);
    expect(input.checkbox('options', 'option_3').checked).toEqual(false);
  });

  it('sets initial "checked" for type "checkbox" without a value', () => {
    const initialState = { option1: true };
    const [, input] = useFormState(initialState);
    expect(input.checkbox('option1').checked).toEqual(true);
    expect(input.checkbox('option1').value).toEqual('');
    expect(input.checkbox('option2').checked).toEqual(false);
    expect(input.checkbox('option2').value).toEqual('');
  });

  it('sets initial "checked" for type "radio"', () => {
    const [, input] = useFormState({ option: 'no' });
    expect(input.radio('option', 'yes').checked).toEqual(false);
    expect(input.radio('option', 'no').checked).toEqual(true);
  });
});

describe('onChange updates inputs value', () => {
  it.each([...textLikeInputs, 'textarea'])(
    'updates value for type "%s"',
    type => {
      const { change, input } = renderInput(type, 'input-name');
      change({ value: `value for ${type}` });
      expect(input).toHaveAttribute('value', `value for ${type}`);
    },
  );

  it.each(numericInputs)('updates value for type "%s"', type => {
    const { change, input } = renderInput(type, 'input-name');
    change({ value: '10' });
    expect(input).toHaveAttribute('value', '10');
  });

  it('updates value for type "color"', () => {
    const { change, input } = renderInput('color', 'input-name');
    change({ value: '#ffffff' });
    expect(input).toHaveAttribute('value', '#ffffff');
  });

  it.each([
    ['week', '2018-W01'],
    ['date', '2018-11-01'],
    ['time', '02:00'],
    ['month', '2018-11'],
  ])('updates value for type %s', (type, value) => {
    const { change, input } = renderInput(type, 'input-name');
    change({ value });
    expect(input).toHaveAttribute('value', value);
  });

  it('updates value for type "checkbox"', () => {
    const name = 'collection';
    const value = 'item';
    const { click, changeHandler } = renderInput('checkbox', name, value);
    click();
    expect(changeHandler).toHaveBeenLastCalledWithValues({ [name]: [value] });
    click();
    expect(changeHandler).toHaveBeenLastCalledWithValues({ [name]: [] });
  });

  it('updates value for type "checkbox" without a value', () => {
    const name = 'remember_me';
    const { click, changeHandler } = renderInput('checkbox', name);
    click();
    expect(changeHandler).toHaveBeenLastCalledWithValues({ [name]: true });
    click();
    expect(changeHandler).toHaveBeenLastCalledWithValues({ [name]: false });
  });

  it('updates value for type "radio"', () => {
    const { changeHandler, click } = renderInput('radio', 'radio', 'option');
    expect(changeHandler).toHaveBeenLastCalledWithValues({ radio: '' });
    click();
    expect(changeHandler).toHaveBeenLastCalledWithValues({ radio: 'option' });
  });

  it('updates value for type "select"', () => {
    const values = ['option_1', 'option_2'];
    const { change, changeHandler } = renderSelect('select', 'select', values);
    expect(changeHandler).toHaveBeenLastCalledWithValues({ select: '' });
    change({ value: 'option_1' });
    expect(changeHandler).toHaveBeenLastCalledWithValues({
      select: 'option_1',
    });
  });

  it('updates value for type "selectMultiple"', () => {
    const values = ['option_1', 'option_2', 'option_3'];
    const { select, change, changeHandler } = renderSelect(
      'selectMultiple',
      'select',
      values,
    );
    expect(changeHandler).toHaveBeenLastCalledWithValues({ select: [] });

    select.options[0].selected = true; // selecting one options
    change();
    expect(changeHandler).toHaveBeenLastCalledWithValues({
      select: ['option_1'],
    });

    select.options[1].selected = true; // selecting another option
    change();
    expect(changeHandler).toHaveBeenLastCalledWithValues({
      select: ['option_1', 'option_2'],
    });

    select.options[0].selected = false; // deselecting an option
    change();
    expect(changeHandler).toHaveBeenLastCalledWithValues({
      select: ['option_2'],
    });
  });
});

describe('Input blur behavior', () => {
  it('marks input as touched on blur', () => {
    const { blur, changeHandler } = renderInput('text', 'name');
    blur();
    expect(changeHandler).toHaveBeenLastCalledWith({
      values: { name: '' },
      validity: { name: false },
      touched: { name: true },
    });
  });

  it('marks input as valid on blur', () => {
    const { change, blur, changeHandler } = renderInput('text', 'name');
    change({ value: 'test' });
    blur();
    expect(changeHandler).toHaveBeenLastCalledWith({
      values: { name: 'test' },
      validity: { name: true },
      touched: { name: true },
    });
  });
});
