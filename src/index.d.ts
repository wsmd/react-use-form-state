// Type definitions for react-use-form-state 0.7.0
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

type StateShape<T> = { [key in keyof T]: string | string[] | number | boolean };

interface UseFormStateHook {
  (
    initialState?: Partial<StateShape<any>> | null,
    options?: Partial<FormOptions<any>>,
  ): [FormState<any>, Inputs<any>];

  <T extends StateShape<T>>(
    initialState?: Partial<T> | null,
    options?: Partial<FormOptions<T>>,
  ): [FormState<T>, Inputs<T>];
}

export const useFormState: UseFormStateHook;

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

interface Inputs<T> {
  selectMultiple(name: keyof T): Omit<BaseInputProps, 'type'> & MultipleProp;
  select(name: keyof T): Omit<BaseInputProps, 'type'>;
  email(name: keyof T): BaseInputProps;
  color(name: keyof T): BaseInputProps;
  password(name: keyof T): BaseInputProps;
  text(name: keyof T): BaseInputProps;
  textarea(name: keyof T): Omit<BaseInputProps, 'type'>;
  url(name: keyof T): BaseInputProps;
  search(name: keyof T): BaseInputProps;
  number(name: keyof T): BaseInputProps;
  range(name: keyof T): BaseInputProps;
  tel(name: keyof T): BaseInputProps;
  radio(name: keyof T, ownValue: OwnValue): RadioProps;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>
   */
  checkbox(name: keyof T, ownValue: OwnValue): CheckboxProps;
  /**
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: keyof T): CheckboxProps;
  date(name: keyof T): BaseInputProps;
  month(name: keyof T): BaseInputProps;
  week(name: keyof T): BaseInputProps;
  time(name: keyof T): BaseInputProps;
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type OwnValue = string | number | boolean | string[];

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
