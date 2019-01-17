import useFormState from '../src/useFormState';
import { renderInput, mockReactUseReducer } from './test-utils';

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
    'textarea',
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
   * Textarea doesn't need a type
   */
  it('returns props from type "textarea"', () => {
    const [, input] = useFormState();
    expect(input.textarea('name')).toEqual({
      name: 'name',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

describe('inputs receive default values from initial state', () => {
  mockReactUseReducer();

  it.each([...textLikeInputs, ...timeInputs, 'color', 'textarea'])(
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
    expect(input.checkbox('option1').value).toEqual(undefined);
    expect(input.checkbox('option2').checked).toEqual(false);
    expect(input.checkbox('option2').value).toEqual(undefined);
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
    const { change, input } = renderInput(type);
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
    const { change, input } = renderInput(type);
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
