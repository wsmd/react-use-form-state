// Type definitions for react-use-form-state 0.1
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

export function useFormState<
  T extends { [key: string]: string | string[] | number }
>(initialState?: T): [FormState<T>, Inputs];

interface FormState<T> {
  values: FormStateValues<T>;
  validity: FormStateValidations<T>;
  touched: FormStateValidations<T>;
}

interface Inputs {
  select(name: string): Omit<SharedInputProps, 'type'>;
  email(name: string): SharedInputProps;
  color(name: string): SharedInputProps;
  password(name: string): SharedInputProps;
  text(name: string): SharedInputProps;
  url(name: string): SharedInputProps;
  search(name: string): SharedInputProps;
  number(name: string): SharedInputProps;
  range(name: string): SharedInputProps;
  tel(name: string): SharedInputProps;
  radio(name: string, value: string): SharedInputProps & CheckedProp;
  checkbox(name: string, value: string): SharedInputProps & CheckedProp;
  date(name: string): SharedInputProps;
  month(name: string): SharedInputProps;
  week(name: string): SharedInputProps;
  time(name: string): SharedInputProps;
}

type Maybe<T> = T | void;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type FormStateValues<T> = { readonly [A in keyof T]: T[A] } & {
  readonly [key: string]: Maybe<string | string[]>;
};

type FormStateValidations<T> = { readonly [A in keyof T]: Maybe<boolean> } & {
  readonly [key: string]: Maybe<boolean>;
};

interface TypeProp {
  type: string;
}

interface SharedInputProps {
  onChange(e: any): void;
  onBlur(e: any): void;
  value: string;
  name: string;
  type: string;
}

interface CheckedProp {
  checked: boolean;
}
