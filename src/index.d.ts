// Type definitions for react-use-form-state 0.3
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

export function useFormState<
  T extends { [key: string]: string | string[] | number }
>(initialState?: T): [FormState<T>, Inputs];

interface FormState<T> {
  values: InputValues<T>;
  validity: InputValuesValidity<T>;
  touched: InputValuesValidity<T>;
}

interface Inputs {
  selectMultiple(name: string): Omit<InputProps, 'type'> & MultipleProp;
  select(name: string): Omit<InputProps, 'type'>;
  email(name: string): InputProps;
  color(name: string): InputProps;
  password(name: string): InputProps;
  text(name: string): InputProps;
  url(name: string): InputProps;
  search(name: string): InputProps;
  number(name: string): InputProps;
  range(name: string): InputProps;
  tel(name: string): InputProps;
  radio(name: string, value: string): InputProps & CheckedProp;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>
   */
  checkbox(name: string, value: string): InputProps & CheckedProp;
  /**
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: string): InputProps & CheckedProp;
  date(name: string): InputProps;
  month(name: string): InputProps;
  week(name: string): InputProps;
  time(name: string): InputProps;
}

type Maybe<T> = T | void;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type InputValues<T> = { readonly [A in keyof T]: T[A] } & {
  readonly [key: string]: Maybe<string | string[]>;
};

type InputValuesValidity<T> = { readonly [A in keyof T]: Maybe<boolean> } & {
  readonly [key: string]: Maybe<boolean>;
};

interface InputProps {
  onChange(e: any): void;
  onBlur(e: any): void;
  value: string;
  name: string;
  type: string;
}

interface CheckedProp {
  checked: boolean;
}

interface MultipleProp {
  multiple: boolean;
}
