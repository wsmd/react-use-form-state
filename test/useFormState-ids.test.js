import { useFormState } from '../src';
import * as TestUtils from './test-utils';

TestUtils.mockReactUseReducer();
TestUtils.mockReactUseCallback();
TestUtils.mockReactUseRef();

describe('Input IDs', () => {
  /**
   * Label only needs a htmlFor
   */
  it('input method correct props from type "label"', () => {
    const [, input] = useFormState(null, { createIds: true });
    expect(input.label('name')).toEqual({
      htmlFor: expect.any(String),
    });
  });

  it('input method has an "id" prop', () => {
    const [, input] = useFormState(null, { createIds: true });
    expect(input.text('name')).toHaveProperty('id', expect.any(String));
  });

  it('generates unique IDs for inputs with different names', () => {
    const [, input] = useFormState(null, { createIds: true });
    const { id: firstId } = input.text('firstName');
    const { id: lastId } = input.text('lastName');
    expect(firstId).not.toBe(lastId);
  });

  it('generates unique IDs for inputs with the same name and different values', () => {
    const [, input] = useFormState(null, { createIds: true });
    const { id: freeId } = input.radio('plan', 'free');
    const { id: premiumId } = input.radio('plan', 'premium');
    expect(freeId).not.toBe(premiumId);
  });

  it('sets matching IDs for inputs and labels', () => {
    const [, input] = useFormState(null, { createIds: true });
    const { id: inputId } = input.text('name');
    const { htmlFor: labelId } = input.label('name');
    expect(labelId).toBe(inputId);
  });

  it('sets matching IDs for inputs and labels with non string values', () => {
    const [, input] = useFormState(null, { createIds: true });
    const { id: inputId } = input.checkbox('name', 0);
    const { htmlFor: labelId } = input.label('name', 0);
    expect(labelId).toBe(inputId);
  });

  it('sets a custom id when formOptions.createIds is set to a function', () => {
    const customInputFormat = jest.fn((name, value) =>
      value ? `form-${name}-${value}` : `form-${name}`,
    );
    const [, input] = useFormState(null, { createIds: customInputFormat });

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

  it('does not return IDs when formOptions.createIds is set to false', () => {
    const [, input] = useFormState();
    const nameInputProps = input.checkbox('name', 0);
    const nameLabelProps = input.label('name', 0);
    expect(nameInputProps).not.toHaveProperty('id');
    expect(nameLabelProps).not.toHaveProperty('htmlFor');
  });
});
