// Type definitions for react-use-form-state 0.12.1
// Project: https://github.com/wsmd/react-use-form-state
// Definitions by: Waseem Dahman <https://github.com/wsmd>

type StateShape<T> = { [key in keyof T]: any };

// Even though we're accepting a number as a default value for numeric inputs
// (e.g. type=number and type=range), the value stored in state for those
// inputs will be a string
type StateValues<T> = {
  readonly [A in keyof T]: T[A] extends number ? string : T[A];
};

type StateErrors<T, E = string> = {
  readonly [A in keyof T]?: E | string;
};

interface UseFormStateHook {
  (initialState?: Partial<StateShape<any>> | null, options?: FormOptions<any>): [
    FormState<any>,
    Inputs<any>,
  ];
  <T extends StateShape<T>, E = StateErrors<T, string>>(
    initialState?: Partial<T> | null,
    options?: FormOptions<T>,
  ): [FormState<T, E>, Inputs<T>];
}

export const useFormState: UseFormStateHook;

interface FormState<T, E = StateErrors<T, string>> {
  values: StateValues<T>;
  errors: E;
  validity: { readonly [A in keyof T]?: boolean };
  touched: { readonly [A in keyof T]?: boolean };
  pristine: { readonly [A in keyof T]: boolean };
  reset(): void;
  clear(): void;
  setField<K extends keyof T>(name: K, value: T[K]): void;
  setFieldError(name: keyof T, error: any): void;
  clearField(name: keyof T): void;
  resetField(name: keyof T): void;
  isPristine(): boolean;
}

interface FormOptions<T> {
  onChange?(
    event: React.ChangeEvent<InputElement>,
    stateValues: StateValues<T>,
    nextStateValues: StateValues<T>,
  ): void;
  onBlur?(event: React.FocusEvent<InputElement>): void;
  onClear?(): void;
  onReset?(): void;
  onTouched?(event: React.FocusEvent<InputElement>): void;
  validateOnBlur?: boolean;
  withIds?: boolean | ((name: string, value?: string) => string);
}

// Inputs

interface Inputs<T> {
  selectMultiple: InputInitializer<T, SelectMultipleProps<T>>;
  select: InputInitializer<T, TypeLessInputProps<T>>;
  email: InputInitializer<T, BaseInputProps<T>>;
  color: InputInitializer<T, BaseInputProps<T>>;
  password: InputInitializer<T, BaseInputProps<T>>;
  text: InputInitializer<T, BaseInputProps<T>>;
  textarea: InputInitializer<T, TypeLessInputProps<T>>;
  url: InputInitializer<T, BaseInputProps<T>>;
  search: InputInitializer<T, BaseInputProps<T>>;
  number: InputInitializer<T, BaseInputProps<T>>;
  range: InputInitializer<T, BaseInputProps<T>>;
  tel: InputInitializer<T, BaseInputProps<T>>;
  date: InputInitializer<T, BaseInputProps<T>>;
  month: InputInitializer<T, BaseInputProps<T>>;
  week: InputInitializer<T, BaseInputProps<T>>;
  time: InputInitializer<T, BaseInputProps<T>>;
  radio: InputInitializerWithOwnValue<T, CheckableInputProps<T>>;
  checkbox: InputInitializerWithOptionalOwnValue<T, CheckableInputProps<T>>;
  raw: RawInputInitializer<T>;
  label(name: string, value?: string): LabelProps;
  id(name: string, value?: string): string;
}

interface InputInitializer<T, InputProps> {
  <K extends keyof T>(options: InputOptions<T, K>): InputProps;
  <K extends keyof T>(name: K): InputProps;
}

interface InputInitializerWithOwnValue<T, R> {
  <K extends keyof T>(options: InputOptions<T, K, { value: OwnValueType }>): R;
  <K extends keyof T>(name: K, value: OwnValueType): R;
}

interface InputInitializerWithOptionalOwnValue<T, R> {
  <K extends keyof T>(options: InputOptions<T, K, { value?: OwnValueType }>): R;
  <K extends keyof T>(name: K, value?: OwnValueType): R;
}

interface RawInputInitializer<T> {
  <RawValue extends any, K extends keyof T = keyof T>(
    options: RawInputOptions<T, K, RawValue>,
  ): RawInputProps<T, K, RawValue>;
  <RawValue extends any, K extends keyof T = keyof T>(name: K): RawInputProps<T, K, RawValue>;
}

type InputOptions<T, K extends keyof T, OwnOptions = {}> = {
  name: K;
  validateOnBlur?: boolean;
  touchOnChange?: boolean;
  onChange?(event: React.ChangeEvent<InputElement>): void;
  onBlur?(event: React.FocusEvent<InputElement>): void;
  compare?(initialValue: StateValues<T>[K], value: StateValues<T>[K]): boolean;
  validate?(
    value: string,
    values: StateValues<T>,
    event: React.ChangeEvent<InputElement> | React.FocusEvent<InputElement>,
  ): any;
} & OwnOptions;

interface RawInputOptions<T, K extends keyof T, RawValue> {
  name: K;
  touchOnChange?: boolean;
  validateOnBlur?: boolean;
  onBlur?(...args: any[]): void;
  onChange?(rawValue: RawValue): StateValues<T>[K];
  compare?(initialValue: StateValues<T>[K], value: StateValues<T>[K]): boolean;
  validate?(value: StateValues<T>[K], values: StateValues<T>, rawValue: RawValue): any;
}

interface RawInputProps<T, K extends keyof T, RawValue> {
  name: Extract<K, string>;
  value: StateValues<T>[K];
  onChange(rawValue: RawValue): any;
  onBlur(...args: any[]): any;
}

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type OwnValueType = string | number | boolean | string[];

interface BaseInputProps<T> {
  id: string;
  onChange(event: any): void;
  onBlur(event: any): void;
  value: string;
  name: Extract<keyof T, string>;
  type: string;
}

type TypeLessInputProps<T> = Omit<BaseInputProps<T>, 'type'>;

interface CheckableInputProps<T> extends BaseInputProps<T> {
  checked: boolean;
}

interface SelectMultipleProps<T> extends TypeLessInputProps<T> {
  multiple: boolean;
}

interface LabelProps {
  htmlFor: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
