import React, { FC } from 'react';
import { useFormState, FormState } from '../src';

useFormState();
useFormState({});
useFormState(null);

interface FormFields {
  name: string;
  colors: string[];
  power_level: number;
  remember_me: boolean;
}

const initialState = {
  name: 'wsmd',
};

const [formState, input] = useFormState<FormFields>(initialState, {
  onChange(e, stateValues, nextStateValues) {
    const { name, value } = e.target;
    if (name === 'name') {
      // string
      stateValues[name].toLowerCase();
    }
    if (name === 'colors') {
      // string[]
      stateValues[name].forEach(color => console.log(color));
    }
  },
  onBlur(e) {
    const { name, value } = e.target;
  },
  onTouched(e) {
    const { name, value } = e.target;
  },
  withIds: (name, value) => (value ? `${name}.${value.toLowerCase()}` : name),
  validateOnBlur: true,
});

let name: string = formState.values.name;

formState.values.colors.forEach(color => console.log(color));

/**
 * numeric values will be retrieved as strings
 */
let level: string = formState.values.power_level;

let rememberMe: boolean = formState.values.remember_me;

/**
 * values of validity and touched will be determined via the blur event. Until
 * the even is fired, the values will be of type undefined
 */
formState.touched.colors;
formState.validity.name;
formState.values.power_level.split('');
if (formState.errors.colors) {
  // string
  formState.errors.colors.toLocaleLowerCase();
}

<input {...input.checkbox('remember_me')} />;
<input {...input.checkbox('colors', 'red')} />;
<input {...input.radio('name', 'value')} />;
<input {...input.radio('name', true)} />;
<input {...input.radio('name', 123)} />;
<input {...input.radio('name', ['a', 'b'])} />;
<input {...input.color('name')} />;
<input {...input.date('name')} />;
<input {...input.email('name')} />;
<input {...input.month('name')} />;
<input {...input.number('name')} />;
<input {...input.password('name')} />;
<input {...input.range('name')} />;
<input {...input.search('name')} />;
<input {...input.tel('name')} />;
<input {...input.text('name')} />;
<input {...input.time('name')} />;
<input {...input.url('name')} />;
<input {...input.week('name')} />;

<select {...input.select('name')} />;
<select {...input.selectMultiple('name')} />;

<textarea {...input.textarea('name')} />;

<input {...input.text({ name: 'name' })} />;
<input {...input.radio({ name: 'colors', value: 'a' })} />;
<input {...input.checkbox({ name: 'colors', value: '' })} />;
<input {...input.checkbox({ name: 'colors' })} />;

<input
  {...input.text({
    name: 'name',
    validateOnBlur: true,
    validate: (value, values, event) =>
      event.target.validity.valid &&
      value.length >= 3 &&
      parseInt(values.power_level) > 9000,
    onChange: e => console.log(e.target.value),
    onBlur: e => console.log(e.target.value),
  })}
/>;

<input
  {...input.text({
    name: 'name',
    validate: value => {
      const errors = {} as any;
      if (!value.trim()) {
        errors.required = 'Password is required';
      }
      if (!/foobar/.test(value)) {
        errors.weakPassword = 'Password is not strong enough';
      }
      return errors;
    },
  })}
/>;

// Custom validation error types
function CustomErrorTypes() {
  interface I18nError {
    en: string;
    fr: string;
  }

  interface FormErrors {
    name?: string;
    colors?: I18nError;
    power_level?: string;
    remember_me?: string;
  }

  const [formState, input] = useFormState<FormFields, FormErrors>(
    initialState,
    {},
  );

  if (formState.errors.colors && typeof formState.errors.colors !== 'string') {
    formState.errors.colors.en;
  }
}

function CustomErrorTypesWithStateErrors() {
  interface I18nError {
    en: string;
    fr: string;
  }

  interface FormFieldsErrors {
    colors?: string | I18nError;
  }

  const [formState, input] = useFormState<FormFields, FormFieldsErrors>(
    initialState,
    {},
  );

  if (formState.errors.colors && typeof formState.errors.colors !== 'string') {
    formState.errors.colors.en;
  }
}

<label {...input.label('name')} />;

input.id('name');

// typed state

interface ConnectFormState {
  user: string;
  host: string;
  password: string;
  database: string;
  port: number;
}

const [typedState] = useFormState<ConnectFormState>({
  user: 'wsmd',
  port: 80,
});

const { port, host }: { port: string; host: string } = typedState.values;

// untyped

const [state, { raw, text, radio, checkbox }] = useFormState({
  foo: 1,
});

<input {...text('test')} />;
<input {...text({ name: 'text', validateOnBlur: true })} />;
<input {...radio('option', 'a')} />;
<input {...radio({ name: 'option', value: 'a' })} />;
<input {...checkbox({ name: 'option' })} />;
<input {...checkbox({ name: 'option', value: 1 })} />;
<input {...raw('test')} />;

// Raw Input

function RawInputTyped() {
  const DatePicker: FC<{ onChange(value: Date): void; value: string }> = () =>
    null;
  const [formState, { raw }] = useFormState<{ name: string; date: string }>();
  formState.values.date.split('/');
  return (
    <>
      <input {...raw('name')} />
      <DatePicker
        {...raw({
          name: 'date',
          onChange: e => e.toLocaleDateString(),
          validate(value, values, rawValue) {
            value.split('/');
            rawValue.toLocaleDateString();
            return true;
          },
        })}
      />
    </>
  );
}

function RawInputUntyped() {
  const DatePicker: FC<{ onChange(value: Date): void; value: string }> = () =>
    null;
  const [formState, { raw }] = useFormState();
  return (
    <>
      <input {...raw('name')} />
      <DatePicker
        {...raw({
          name: 'date',
          onChange: e => e.toLocaleDateString(),
          validate(value, values, rawValue) {
            value.split('/');
            rawValue.toISOString();
            return true;
          },
        })}
      />
    </>
  );
}

function RawValueInState() {
  const DatePicker: FC<{ onChange(value: Date): any; value: Date }> = () =>
    null;
  const [formState, input] = useFormState<{ date: Date; name: string }>();
  formState.values.date.toISOString();
  return (
    <>
      <input {...input.text('name')} />
      <input {...input.raw('name')} />
      <DatePicker
        {...input.raw({
          name: 'date',
          onChange: e => e,
          validate(value, values, rawValue) {
            value.toLocaleDateString();
            rawValue.toISOString();
            return true;
          },
        })}
      />
    </>
  );
}

function PropsDelegation() {
  interface FormFields {
    email: string;
  }
  interface InputProps {
    formState: FormState<FormFields>;
    name: keyof FormFields;
  }
  const Input: React.FC<InputProps> = ({ formState, name }) => {
    formState.errors[name]; // value of 'name' should be inferred (e.g. "email")
    return null;
  };
  const [formState, input] = useFormState<FormFields>();
  return <Input formState={formState} {...input.email('email')} />;
}

formState.setField('colors', ['red']);
formState.setField({
  name: 'colors',
  value: ['red'],
  error: 'invalid',
  pristine: true,
  validity: false,
  touched: false,
});
