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

interface Inputs<T, Name = keyof T> {
  // prettier-ignore
  selectMultiple: InputInitializer<Args<Name>, Omit<BaseInputProps, 'type'> & MultipleProp>;
  select: InputInitializer<Args<Name>, Omit<BaseInputProps, 'type'>>;
  email: InputInitializer<Args<Name>, BaseInputProps>;
  color: InputInitializer<Args<Name>, BaseInputProps>;
  password: InputInitializer<Args<Name>, BaseInputProps>;
  text: InputInitializer<Args<Name>, BaseInputProps>;
  textarea: InputInitializer<Args<Name>, Omit<BaseInputProps, 'type'>>;
  url: InputInitializer<Args<Name>, BaseInputProps>;
  search: InputInitializer<Args<Name>, BaseInputProps>;
  number: InputInitializer<Args<Name>, BaseInputProps>;
  range: InputInitializer<Args<Name>, BaseInputProps>;
  tel: InputInitializer<Args<Name>, BaseInputProps>;
  radio: InputInitializer<Args<Name, OwnValue>, RadioProps>;
  date: InputInitializer<Args<Name>, BaseInputProps>;
  month: InputInitializer<Args<Name>, BaseInputProps>;
  week: InputInitializer<Args<Name>, BaseInputProps>;
  time: InputInitializer<Args<Name>, BaseInputProps>;
  /**
   * Checkbox inputs with a value will be treated as a collection of choices.
   * Their values in in the form state will be of type Array<string>.
   *
   * Checkbox inputs without a value will be treated as toggles. Their values in
   * in the form state will be of type boolean
   */
  checkbox(name: Name, ownValue?: OwnValue): CheckboxProps;
  checkbox(options: InputOptions<Name, Maybe<OwnValue>>): CheckboxProps;

  label(name: string, value?: string): LabelProps;
  id(name: string, value?: string): string;
}

interface InputInitializer<Args extends any[], ReturnValue> {
  (...args: Args): ReturnValue;
  (options: InputOptions<Args[0], Args[1]>): ReturnValue;
}

type InputOptions<Name, Value = void> = {
  name: Name;
  validateOnBlur?: boolean;
  validate?(input: { value: string }): boolean;
  onChange?(e: React.ChangeEvent<InputElement>): void;
  onBlur?(e: React.FocusEvent<InputElement>): void;
} & WithValue<Value>;

type WithValue<V> = V extends OwnValue
  ? { value: OwnValue }
  : V extends undefined
  ? { value?: OwnValue }
  : {};

type Args<Name, Value = void> = [Name, Value];

type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type OwnValue = string | number | boolean | string[];

interface BaseInputProps {
  id: string;
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

interface LabelProps {
  htmlFor: string;
}

// Utils

type Maybe<T> = T | undefined;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
