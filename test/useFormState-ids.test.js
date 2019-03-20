import { useFormState } from '../src';
import { renderHook } from './test-utils';

describe('Input IDs', () => {
  /**
   * Label only needs a htmlFor
   */
  it('input method correct props from type "label"', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    expect(input.label('name')).toEqual({
      htmlFor: expect.any(String),
    });
  });

  it('input method has an "id" prop', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    expect(input.text('name')).toHaveProperty('id', expect.any(String));
  });

  it('generates unique IDs for inputs with different names', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    const { id: firstId } = input.text('firstName');
    const { id: lastId } = input.text('lastName');
    expect(firstId).not.toBe(lastId);
  });

  it('generates unique IDs for inputs with the same name and different values', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    const { id: freeId } = input.radio('plan', 'free');
    const { id: premiumId } = input.radio('plan', 'premium');
    expect(freeId).not.toBe(premiumId);
  });

  it('sets matching IDs for inputs and labels', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    const { id: inputId } = input.text('name');
    const { htmlFor: labelId } = input.label('name');
    expect(labelId).toBe(inputId);
  });

  it('sets matching IDs for inputs and labels with non string values', () => {
    const { result } = renderHook(() => useFormState(null, { withIds: true }));
    const [, input] = result.current;
    const { id: inputId } = input.checkbox('name', 0);
    const { htmlFor: labelId } = input.label('name', 0);
    expect(labelId).toBe(inputId);
  });

  it('sets a custom id when formOptions.withIds is set to a function', () => {
    const customInputFormat = jest.fn((name, value) =>
      value ? `form-${name}-${value}` : `form-${name}`,
    );
    const { result } = renderHook(() =>
      useFormState(null, { withIds: customInputFormat }),
    );
    const [, input] = result.current;

    // inputs with own values (e.g. radio button)

    const radioProps = input.radio('option', 0);
    expect(radioProps.id).toEqual('form-option-0');
    expect(customInputFormat).toHaveBeenCalledWith('option', '0');

    const radioLabelProps = input.label('option', 0);
    expect(radioLabelProps.htmlFor).toEqual('form-option-0');
    expect(customInputFormat).toHaveBeenNthCalledWith(2, 'option', '0');

    // inputs with no own values (e.g. text input)

    const textProps = input.text('name');
    expect(textProps.id).toEqual('form-name');
    expect(customInputFormat).toHaveBeenLastCalledWith('name');

    const textLabelProps = input.label('name');
    expect(textLabelProps.htmlFor).toEqual('form-name');
    expect(customInputFormat).toHaveBeenNthCalledWith(3, 'name');
  });

  it('does not return IDs when formOptions.withIds is set to false', () => {
    const { result } = renderHook(() => useFormState());
    const [, input] = result.current;
    const nameInputProps = input.checkbox('name', 0);
    const nameLabelProps = input.label('name', 0);
    expect(nameInputProps).not.toHaveProperty('id');
    expect(nameLabelProps).not.toHaveProperty('htmlFor');
  });
});
