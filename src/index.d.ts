// Type definitions for react-use-form-state 0.11.0
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

type StateShape<T> = { [key in keyof T]: any };

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

type SetFieldsOptions = {
  touched?: StateValidity<boolean>;
  validity?: StateValidity<boolean>;
  errors?: StateErrors<string, string>;
};

interface FormState<T, E = StateErrors<T, string>> {
  values: StateValues<T>;
  validity: StateValidity<T>;
  touched: StateValidity<T>;
  errors: E;
  reset(): void;
  clear(): void;
  setField<K extends keyof T>(name: K, value: T[K]): void;
  setFields(fieldValues: StateValues<T>, options?: SetFieldsOptions): void;
  setFieldError(name: keyof T, error: string): void;
  clearField(name: keyof T): void;
  resetField(name: keyof T): void;
}

interface FormOptions<T> {
  onChange(
    event: React.ChangeEvent<InputElement>,
    stateValues: StateValues<T>,
    nextStateValues: StateValues<T>,
  ): void;
  onBlur(event: React.FocusEvent<InputElement>): void;
  onClear(): void;
  onReset(): void;
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

interface Inputs<T, Name extends keyof T = keyof T> {
  // prettier-ignore
  selectMultiple: InputInitializer<T, Args<Name>, Omit<BaseInputProps<T>, 'type'> & MultipleProp>;
  select: InputInitializer<T, Args<Name>, Omit<BaseInputProps<T>, 'type'>>;
  email: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  color: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  password: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  text: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  textarea: InputInitializer<T, Args<Name>, Omit<BaseInputProps<T>, 'type'>>;
  url: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  search: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  number: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  range: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  tel: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  radio: InputInitializer<T, Args<Name, OwnValue>, RadioProps<T>>;
  date: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  month: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  week: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  time: InputInitializer<T, Args<Name>, BaseInputProps<T>>;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>.
   *
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: Name, ownValue?: OwnValue): CheckboxProps<T>;
  checkbox(options: InputOptions<T, Name, Maybe<OwnValue>>): CheckboxProps<T>;

  raw<RawValue, Name extends keyof T = keyof T>(
    name: Name,
  ): RawInputProps<T, Name, RawValue>;
  raw<RawValue, Name extends keyof T = keyof T>(
    options: RawInputOptions<T, Name, RawValue>,
  ): RawInputProps<T, Name, RawValue>;

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

interface RawInputOptions<T, Name extends keyof T, RawValue> {
  name: Name;
  validateOnBlur?: boolean;
  touchOnChange?: boolean;
  validate?(
    value: StateValues<T>[Name],
    values: StateValues<T>,
    rawValue: RawValue,
  ): any;
  onChange?(rawValue: RawValue): StateValues<T>[Name];
  onBlur?(...args: any[]): void;
}

interface RawInputProps<T, Name extends keyof T, RawValue> {
  name: Extract<Name, string>;
  value: StateValues<T>[Name];
  onChange(rawValue: RawValue): any;
  onBlur(...args: any[]): any;
}

type WithValue<V> = V extends OwnValue
  ? { value: OwnValue }
  : V extends undefined
  ? { value?: OwnValue }
  : {};

type Args<Name, Value = void> = [Name, Value];

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type OwnValue = string | number | boolean | string[];

interface BaseInputProps<T> {
  id: string;
  onChange(event: any): void;
  onBlur(event: any): void;
  value: string;
  name: Extract<keyof T, string>;
  type: string;
}

interface CheckboxProps<T> extends BaseInputProps<T> {
  checked: boolean;
}

interface RadioProps<T> extends CheckboxProps<T> {}

interface MultipleProp {
  multiple: boolean;
}

interface LabelProps {
  htmlFor: string;
}

// Utils

type Maybe<T> = T | undefined;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
