// Type definitions for react-use-form-state 0.6.0
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

export function useFormState<
  T extends { [key in keyof T]: string | string[] | number | boolean }
>(
  initialState?: Partial<T> | null,
  options?: Partial<FormOptions<T>>,
): [FormState<T>, Inputs];

interface FormState<T> {
  values: StateValues<T>;
  validity: StateValidity<T>;
  touched: StateValidity<T>;
}

interface FormOptions<T> {
  onChange(
    e: React.ChangeEvent<InputElement>,
    stateValues: StateValues<T>,
    nextStateValues: StateValues<T>,
  ): void;
  onBlur(e: React.FocusEvent<InputElement>): void;
  onTouched(e: React.FocusEvent<InputElement>): void;
}

// prettier-ignore
type StateValues<T> = {
  /**
   * Even though we're accepting a number as a default value for numeric inputs
   * (e.g. type=number and type=range), the value we store in  state for those
   * inputs will will be of a string
   */
  readonly [A in keyof T]: T[A] extends number ? string : T[A]
} & {
  readonly [key: string]: Maybe<string | string[] | boolean>;
};

type StateValidity<T> = { readonly [A in keyof T]: Maybe<boolean> } & {
  readonly [key: string]: Maybe<boolean>;
};

// Inputs

interface Inputs {
  selectMultiple(name: string): Omit<BaseInputProps, 'type'> & MultipleProp;
  select(name: string): Omit<BaseInputProps, 'type'>;
  email(name: string): BaseInputProps;
  color(name: string): BaseInputProps;
  password(name: string): BaseInputProps;
  text(name: string): BaseInputProps;
  textarea(name: string): Omit<BaseInputProps, 'type'>;
  url(name: string): BaseInputProps;
  search(name: string): BaseInputProps;
  number(name: string): BaseInputProps;
  range(name: string): BaseInputProps;
  tel(name: string): BaseInputProps;
  radio(name: string, value: string): RadioProps;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>
   */
  checkbox(name: string, value: string): CheckboxProps;
  /**
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: string): CheckboxProps;
  date(name: string): BaseInputProps;
  month(name: string): BaseInputProps;
  week(name: string): BaseInputProps;
  time(name: string): BaseInputProps;
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface BaseInputProps {
  onChange(e: any): void;
  onBlur(e: any): void;
  value: string;
  name: string;
  type: string;
}

interface CheckboxProps extends BaseInputProps {
  checked: boolean;
}

interface RadioProps extends CheckboxProps {}

interface MultipleProp {
  multiple: boolean;
}

// Utils

type Maybe<T> = T | undefined;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
