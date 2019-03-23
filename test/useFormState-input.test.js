import React from 'react';
import { useFormState } from '../src';
import { renderWithFormState, renderHook, InputTypes } from './test-utils';

describe('input type methods return correct props object', () => {
  /**
   * Must return type and value
   */
  it.each([
    ...InputTypes.textLike,
    ...InputTypes.numeric,
    ...InputTypes.time,
    'color',
  ])('returns props for type "%s"', type => {
    const { result } = renderHook(() => useFormState());
    expect(result.current[1][type]('input-name')).toEqual({
      type,
      name: 'input-name',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  /**
   * Checkbox must have a type, value, and checked
   */
  it('returns props for type "checkbox"', () => {
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].checkbox('option', 'option_1')).toEqual({
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
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].checkbox('option')).toEqual({
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
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].radio('radio_name', 'radio_option')).toEqual({
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
      const { result } = renderHook(() => useFormState());
      const input = result.current[1];
      expect(input.checkbox('option1', ownValue).value).toEqual(expected);
      expect(input.radio('option2', ownValue).value).toEqual(expected);
    },
  );

  /**
   * Select doesn't need a type
   */
  it('returns props for type "select"', () => {
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].select('select_name')).toEqual({
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
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].selectMultiple('select_name')).toEqual({
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
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].textarea('name')).toEqual({
      name: 'name',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  it('returns props for type "text" when passing an object', () => {
    const { result } = renderHook(() => useFormState({ username: 'wsmd' }));
    expect(result.current[1].text({ name: 'username' })).toEqual({
      type: 'text',
      name: 'username',
      value: 'wsmd',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });

  it('returns props for type "checkbox" when passing an object', () => {
    const { result } = renderHook(() => useFormState());
    expect(result.current[1].checkbox({ name: 'options', value: 0 })).toEqual({
      type: 'checkbox',
      checked: false,
      name: 'options',
      value: '0',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
  });
});

describe('inputs receive default values from initial state', () => {
  it.each([
    ...InputTypes.textLike,
    ...InputTypes.time,
    'color',
    'textarea',
    'select',
  ])('sets initial "value" for type "%s"', type => {
    const initialState = { 'input-name': 'input-value' };
    const { result } = renderHook(() => useFormState(initialState));
    const [, input] = result.current;
    expect(input[type]('input-name').value).toEqual('input-value');
  });

  it.each(InputTypes.numeric)('sets initial "value" for type "%s"', type => {
    const initialState = { 'input-name': '101' };
    const { result } = renderHook(() => useFormState(initialState));
    const [, input] = result.current;
    expect(input[type]('input-name').value).toEqual('101');
  });

  it('sets initial "value" for type "selectMultiple"', () => {
    const value = ['option_1', 'option_2'];
    const initialState = { multiple: value };
    const { result } = renderHook(() => useFormState(initialState));
    const [, input] = result.current;
    expect(input.selectMultiple('multiple').value).toEqual(value);
  });

  it('sets initial "checked" for type "checkbox"', () => {
    const initialState = { options: ['option_1', 'option_2'] };
    const { result } = renderHook(() => useFormState(initialState));
    const [, input] = result.current;
    expect(input.checkbox('options', 'option_1').checked).toEqual(true);
    expect(input.checkbox('options', 'option_2').checked).toEqual(true);
    expect(input.checkbox('options', 'option_3').checked).toEqual(false);
  });

  it('sets initial "checked" for type "checkbox" without a value', () => {
    const initialState = { option1: true };
    const { result } = renderHook(() => useFormState(initialState));
    const [, input] = result.current;
    expect(input.checkbox('option1').checked).toEqual(true);
    expect(input.checkbox('option1').value).toEqual('');
    expect(input.checkbox('option2').checked).toEqual(false);
    expect(input.checkbox('option2').value).toEqual('');
  });

  it('sets initial "checked" for type "radio"', () => {
    const { result } = renderHook(() => useFormState({ option: 'no' }));
    const [, input] = result.current;
    expect(input.radio('option', 'yes').checked).toEqual(false);
    expect(input.radio('option', 'no').checked).toEqual(true);
  });
});

describe('onChange updates inputs value', () => {
  it.each([...InputTypes.textLike, 'textarea'])(
    'updates value for type "%s"',
    type => {
      const { change, root } = renderWithFormState(([, inputs]) => (
        <input {...inputs[type]('input-name')} />
      ));
      change({ value: `value for ${type}` });
      expect(root).toHaveAttribute('value', `value for ${type}`);
    },
  );

  it.each(InputTypes.numeric)('updates value for type "%s"', type => {
    const { change, root } = renderWithFormState(([, inputs]) => (
      <input {...inputs[type]('input-name')} />
    ));
    change({ value: '10' });
    expect(root).toHaveAttribute('value', '10');
  });

  it('updates value for type "color"', () => {
    const { change, root } = renderWithFormState(([, { color }]) => (
      <input {...color('input-name')} />
    ));
    change({ value: '#ffffff' });
    expect(root).toHaveAttribute('value', '#ffffff');
  });

  it.each([
    ['week', '2018-W01'],
    ['date', '2018-11-01'],
    ['time', '02:00'],
    ['month', '2018-11'],
  ])('updates value for type %s', (type, value) => {
    const { change, root } = renderWithFormState(([, inputs]) => (
      <input {...inputs[type]('input-name')} />
    ));
    change({ value });
    expect(root).toHaveAttribute('value', value);
  });

  it('updates value for type "checkbox"', () => {
    const name = 'collection';
    const value = 'item';
    const { click, formState } = renderWithFormState(([, { checkbox }]) => (
      <input {...checkbox(name, value)} />
    ));

    click();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { [name]: [value] } }),
    );

    click();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { [name]: [] } }),
    );
  });

  it('updates value for type "checkbox" without a value', () => {
    const name = 'remember_me';
    const { click, formState } = renderWithFormState(([, { checkbox }]) => (
      <input {...checkbox(name)} />
    ));

    click();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { [name]: true } }),
    );

    click();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { [name]: false } }),
    );
  });

  it('updates value for type "radio"', () => {
    const { formState, click } = renderWithFormState(([, { radio }]) => (
      <input {...radio('radio', 'option')} />
    ));
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { radio: '' } }),
    );
    click();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { radio: 'option' } }),
    );
  });

  it('updates value for type "select"', () => {
    const { formState, change } = renderWithFormState(([, { select }]) => (
      <select {...select('select')}>
        <option value="option_1" />
        <option value="option_2" />
      </select>
    ));
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: '' } }),
    );
    change({ value: 'option_1' });
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: 'option_1' } }),
    );
  });

  it('updates value for type "selectMultiple"', () => {
    const { formState, change, root: select } = renderWithFormState(
      ([, { selectMultiple }]) => (
        <select {...selectMultiple('select')}>
          <option value="option_1" />
          <option value="option_2" />
          <option value="option_3" />
        </select>
      ),
    );

    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: [] } }),
    );

    select.options[0].selected = true; // selecting one options
    change();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: ['option_1'] } }),
    );

    select.options[1].selected = true; // selecting another option
    change();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: ['option_1', 'option_2'] } }),
    );

    select.options[0].selected = false; // deselecting an option
    change();
    expect(formState.current).toEqual(
      expect.objectContaining({ values: { select: ['option_2'] } }),
    );
  });
});

describe('passing an object to input type method', () => {
  it('calls input onChange', () => {
    const onChange = jest.fn();
    const { change } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', onChange })} />
    ));
    change({ value: 'test' });
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls input onBlur', () => {
    const onBlur = jest.fn();
    const { blur } = renderWithFormState(([, { text }]) => (
      <input {...text({ name: 'name', onBlur })} />
    ));
    blur();
    expect(onBlur).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('Input blur behavior', () => {
  it('marks input as touched on blur', () => {
    const { blur, formState } = renderWithFormState(([, { text }]) => (
      <input {...text('name')} />
    ));
    blur();
    expect(formState.current).toEqual({
      values: { name: '' },
      validity: { name: true },
      errors: {},
      touched: { name: true },
    });
  });

  it('marks input as invalid on blur', () => {
    const { blur, formState } = renderWithFormState(([, { text }]) => (
      <input {...text('name')} required />
    ));
    blur();
    expect(formState.current).toEqual({
      values: { name: '' },
      validity: { name: false },
      errors: {},
      touched: { name: true },
    });
  });
});

describe('Input props are memoized', () => {
  it('does not cause re-render of memoized components', () => {
    const renderCheck = jest.fn(() => true);
    const MemoInput = React.memo(
      props => renderCheck() && <input {...props} />,
    );
    const { change, root } = renderWithFormState(([, { text }]) => (
      <div>
        <input {...text('foo')} />
        <MemoInput {...text('bar')} />
      </div>
    ));
    change({ value: 'a' }, root.childNodes[0]);
    change({ value: 'b' }, root.childNodes[0]);
    expect(renderCheck).toHaveBeenCalledTimes(1);
    change({ value: 'c' }, root.childNodes[1]);
    expect(renderCheck).toHaveBeenCalledTimes(2);
  });
});
