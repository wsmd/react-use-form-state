import { useFormState } from '../src';
import { renderHook, InputTypes } from './test-utils';

describe('useFormState API', () => {
  it('returns an array matching [formState, input]', () => {
    const { result } = renderHook(() => useFormState());
    expect(result.current).toEqual([
      {
        values: {},
        validity: {},
        touched: {},
        errors: {},
        clear: expect.any(Function),
        setField: expect.any(Function),
        setFieldError: expect.any(Function),
        clearField: expect.any(Function),
      },
      expect.any(Object),
    ]);
  });

  it.each([
    ...InputTypes.textLike,
    ...InputTypes.numeric,
    ...InputTypes.time,
    'checkbox',
    'color',
    'radio',
    'select',
    'selectMultiple',
    'textarea',
    'label',
  ])('has a method for type "%s"', type => {
    const { result } = renderHook(() => useFormState());
    const [, inputs] = result.current;
    expect(inputs[type]).toBeInstanceOf(Function);
  });

  it('sets initial/default state for inputs', () => {
    const initialState = {
      name: 'Mary Poppins',
      email: 'user@example.com',
      options: ['foo', 'bar'],
    };
    const { result } = renderHook(() => useFormState(initialState));
    const [formState] = result.current;
    expect(formState.values).toEqual(expect.objectContaining(initialState));
  });
});
