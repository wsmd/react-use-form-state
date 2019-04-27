// Type definitions for react-use-form-state 0.9.0
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

type StateShape<T> = { [key in keyof T]: string | string[] | number | boolean };

interface UseFormStateHook {
  (
    initialState?: Partial<StateShape<any>> | null,
    options?: Partial<FormOptions<any>>,
  ): [FormState<any>, Inputs<any>];

  <T extends StateShape<T>, E = StateErrors<T, string>>(
    initialState?: Partial<T> | null,
    options?: Partial<FormOptions<T>>,
  ): [FormState<T, E>, Inputs<T>];
}

export const useFormState: UseFormStateHook;

interface FormState<T, E = StateErrors<T, string>> {
  values: StateValues<T>;
  validity: StateValidity<T>;
  touched: StateValidity<T>;
  errors: E;
}

interface FormOptions<T> {
  onChange(
    event: React.ChangeEvent<InputElement>,
    stateValues: StateValues<T>,
    nextStateValues: StateValues<T>,
  ): void;
  onBlur(event: React.FocusEvent<InputElement>): void;
  onTouched(event: React.FocusEvent<InputElement>): void;
  withIds: boolean | ((name: string, value?: string) => string);
}

// prettier-ignore
type StateValues<T> = {
  /**
   * Even though we're accepting a number as a default value for numeric inputs
   * (e.g. type=number and type=range), the value we store in  state for those
   * inputs will will be of a string
   */
  readonly [A in keyof T]: T[A] extends number ? string : T[A]
};

type StateValidity<T> = { readonly [A in keyof T]: Maybe<boolean> };

type StateErrors<T, E = string> = { readonly [A in keyof T]?: E | string };

// Inputs

interface Inputs<T, Name = keyof T> {
  // prettier-ignore
  selectMultiple: InputInitializer<T, Args<Name>, Omit<BaseInputProps, 'type'> & MultipleProp>;
  select: InputInitializer<T, Args<Name>, Omit<BaseInputProps, 'type'>>;
  email: InputInitializer<T, Args<Name>, BaseInputProps>;
  color: InputInitializer<T, Args<Name>, BaseInputProps>;
  password: InputInitializer<T, Args<Name>, BaseInputProps>;
  text: InputInitializer<T, Args<Name>, BaseInputProps>;
  textarea: InputInitializer<T, Args<Name>, Omit<BaseInputProps, 'type'>>;
  url: InputInitializer<T, Args<Name>, BaseInputProps>;
  search: InputInitializer<T, Args<Name>, BaseInputProps>;
  number: InputInitializer<T, Args<Name>, BaseInputProps>;
  range: InputInitializer<T, Args<Name>, BaseInputProps>;
  tel: InputInitializer<T, Args<Name>, BaseInputProps>;
  radio: InputInitializer<T, Args<Name, OwnValue>, RadioProps>;
  date: InputInitializer<T, Args<Name>, BaseInputProps>;
  month: InputInitializer<T, Args<Name>, BaseInputProps>;
  week: InputInitializer<T, Args<Name>, BaseInputProps>;
  time: InputInitializer<T, Args<Name>, BaseInputProps>;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>.
   *
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: Name, ownValue?: OwnValue): CheckboxProps;
  checkbox(options: InputOptions<T, Name, Maybe<OwnValue>>): CheckboxProps;

  raw<Y>(name: Name, value?: Y): RawInputProps<Y>;
  raw<Y>(options: RawInputOptions<T, Y, Name>): RawInputProps<Y>;

  label(name: string, value?: string): LabelProps;
  id(name: string, value?: string): string;
}

interface InputInitializer<T, Args extends any[], ReturnValue> {
  (...args: Args): ReturnValue;
  (options: InputOptions<T, Args[0], Args[1]>): ReturnValue;
}

type InputOptions<T, Name, Value = void> = {
  name: Name;
  validateOnBlur?: boolean;
  touchOnChange?: boolean;
  validate?(
    value: string,
    values: StateValues<T>,
    event: React.ChangeEvent<InputElement> | React.FocusEvent<InputElement>,
  ): any;
  onChange?(event: React.ChangeEvent<InputElement>): void;
  onBlur?(event: React.FocusEvent<InputElement>): void;
} & WithValue<Value>;

type RawInputOptions<T, Y, Name> = {
  name: Name;
  validateOnBlur?: boolean;
  touchOnChange?: boolean;
  validate?(value: Y, values: StateValues<T>, event: (value: Y) => void): any;
  onChange?(value: Y): void;
  onBlur?(): void;
};

type WithValue<V> = V extends OwnValue
  ? { value: OwnValue }
  : V extends undefined ? { value?: OwnValue } : {};

type Args<Name, Value = void> = [Name, Value];

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type OwnValue = string | number | boolean | string[];

interface BaseInputProps {
  id: string;
  onChange(event: any): void;
  onBlur(event: any): void;
  value: string;
  name: string;
  type: string;
}

interface CheckboxProps extends BaseInputProps {
  checked: boolean;
}

interface RawInputProps<T> {
  onChange(event: (value: T) => void): void;
  onBlur(): void;
  value: T;
}

interface RadioProps extends CheckboxProps {}

interface MultipleProp {
  multiple: boolean;
}

interface LabelProps {
  htmlFor: string;
}

// Utils

type Maybe<T> = T | undefined;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
