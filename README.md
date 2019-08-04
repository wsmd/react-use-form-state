<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/47732577-e00e9280-dc3c-11e8-9f2f-dd290b29fd35.png" width="128">
  <br>
  react-use-form-state
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-use-form-state">
    <img src="https://img.shields.io/npm/v/react-use-form-state.svg" alt="Current Release" />
  </a>
  <a href="https://www.npmjs.com/package/react-use-form-state">
    <img src="https://badgen.net/npm/dt/react-use-form-state" alt="Downloads" />
  </a>
  <a href="https://travis-ci.org/wsmd/react-use-form-state">
    <img src="https://travis-ci.org/wsmd/react-use-form-state.svg?branch=master" alt="CI Build">
  </a>
  <a href="https://coveralls.io/github/wsmd/react-use-form-state?branch=master">
    <img src="https://coveralls.io/repos/github/wsmd/react-use-form-state/badge.svg?branch=master" alt="Coverage Status">
  </a>
  <a href="https://github.com/wsmd/react-use-form-state/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/wsmd/react-use-form-state.svg" alt="Licence">
  </a>
</p>

<details>
<summary>📖 Table of Contents</summary>
<p>

- [Motivation](#motivation)
- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Initial State](#initial-state)
  - [Global Handlers](#global-handlers)
  - [Advanced Input Options](#advanced-input-options)
  - [Custom Input Validation](#custom-input-validation)
  - [Without Using a `<form />` Element](#without-using-a-form--element)
  - [Labels](#labels)
  - [Custom Controls](#custom-controls)
  - [Updating Fields Manually](#updating-fields-manually)
  - [Resetting The From State](#resetting-the-from-state)
- [Working with TypeScript](#working-with-typescript)
- [API](#api)
  - [`initialState`](#initialstate)
  - [`formOptions`](#formoptions)
    - [`formOptions.onBlur`](#formoptionsonblur)
    - [`formOptions.onChange`](#formoptionsonchange)
    - [`formOptions.onTouched`](#formoptionsontouched)
    - [`formOptions.onClear`](#formoptionsonclear)
    - [`formOptions.onReset`](#formoptionsonreset)
    - [`formOptions.withIds`](#formoptionswithids)
  - [`[formState, inputs]`](#formstate-inputs)
    - [Form State](#form-state)
    - [Input Types](#input-types)
    - [Input Options](#input-options)
- [License](#license)

</p>
</details>

## Motivation

Managing form state in React can be a bit unwieldy sometimes. There are [plenty of great solutions](https://www.npmjs.com/search?q=react%20forms&ranking=popularity) already available that make managing forms state a breeze. However, many of those solutions are opinionated, packed with tons of features that may end up not being used, and/or require shipping a few extra bytes!

Luckily, the recent introduction of [React Hooks](https://reactjs.org/docs/hooks-intro.html) and the ability to write custom hooks have enabled new possibilities when it comes sharing state logic. Form state is no exception!

`react-use-form-state` is a small React Hook that attempts to [simplify managing form state](#examples), using the native form input elements you are familiar with!

## Getting Started

To get it started, add `react-use-form-state` to your project:

```
npm install --save react-use-form-state
```

Please note that `react-use-form-state` requires `react@^16.8.0` as a peer dependency.

## Examples

### Basic Usage

```jsx
import { useFormState } from 'react-use-form-state';

export default function SignUpForm({ onSubmit }) {
  const [formState, { text, email, password, radio }] = useFormState();

  function handleSubmit(e) {
    // ...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input {...text('name')} />
      <input {...email('email')} required />
      <input {...password('password')} required minLength="8" />
      <input {...radio('plan', 'free')} />
      <input {...radio('plan', 'premium')} />
    </form>
  );
}
```

From the example above, as the user fills in the form, the `formState` object will look something like this:

```js
{
  values: {
    name: 'Mary Poppins',
    email: 'mary@example.com',
    password: '1234',
    plan: 'free',
  },
  touched: {
    name: true,
    email: true,
    password: true,
    plan: true,
  },
  validity: {
    name: true,
    email: true,
    password: false,
    plan: true,
  },
  errors: {
    password: 'Please lengthen this text to 8 characters or more',
  },
  clear: Function,
  clearField: Function,
  reset: Function,
  resetField: Function,
  setField: Function,
}
```

### Initial State

`useFormState` takes an initial state object with keys matching the names of the inputs.

```jsx
export default function RentCarForm() {
  const [formState, { checkbox, radio, select }] = useFormState({
    trip: 'roundtrip',
    type: ['sedan', 'suv', 'van'],
  });
  return (
    <form>
      <select {...select('trip')}>
        <option value="roundtrip">Same Drop-off</option>
        <option value="oneway">Different Drop-off</option>
      </select>
      <input {...checkbox('type', 'sedan')} />
      <input {...checkbox('type', 'suv')} />
      <input {...checkbox('type', 'van')} />
      <button>Submit</button>
    </form>
  );
}
```

### Global Handlers

`useFormState` supports [a variety of form-level event handlers](#formoptions) that you could use to perform certain actions:

```jsx
export default function RentCarForm() {
  const [formState, { email, password }] = useFormState(null, {
    onChange(e, stateValues, nextStateValues) {
      const { name, value } = e.target;
      console.log(`the ${name} input has changed!`);
    },
  });
  return (
    <>
      <input {...text('username')} />
      <input {...password('password')} />
    </>
  );
}
```

### Advanced Input Options

`useFormState` provides a quick and simple API to get started with building a from and managing its state. It also supports [HTML5 form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) out of the box.

```jsx
<input {...password('password')} required minLength="8" />
```

While this covers that majority of validation cases, there are times when you need to attach custom event handlers or perform custom validation.

For this, all [input functions](#input-types) provide an alternate API that allows you attach input-level event handlers such as `onChange` and `onBlur`, as well as providing custom validation logic.

```jsx
export default function SignUpForm() {
  const [state, { text, password }] = useFormState();
  return (
    <>
      <input {...text('username')} required />
      <input
        {...password({
          name: 'password',
          onChange: e => console.log('password input changed!'),
          onBlur: e => console.log('password input lost focus!'),
          validate: (value, values, e) => validatePassword(value),
          validateOnBlur: true,
        })}
      />
    </>
  );
};
```

### Custom Input Validation

The example above [demonstrates](#advanced-input-options) how you can determine the validity of an input by passing a `validate()` method. You can also specify custom validation errors using the same method.

The input is considered **valid** if this method returns `true` or `undefined`.

Any [truthy value](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) other than `true` returned from this method will make the input **invalid**. This returned value is used as a **custom validation error** that can be retrieved from [`state.errors`](#form-state).

For convenience, empty collection values such as empty objects, empty arrays, empty maps, empty sets are not considered invalidation errors, and if returned the input will be valid.

```jsx
<input
  {...password({
    name: 'password',

    // can also return objects, arrays, etc, for more complex error objects
    validate: (value, values, event) => {
      if (!value.trim()) {
        return 'Password is required';
      }
      if (!STRONG_PASSWORD_REGEX.test(value)) {
        return 'Password is not strong enough';
      }
    },

  })}
/>
```

If the input's value is invalid based on the rules specified above, the form state will look similar to this:

```js
{
  validity: {
    password: false,
  },
  errors: {
    password: 'Password is not strong enough',
  }
}
```

If the `validate()` method is not specified, `useFormState` will fallback to the HTML5 constrains validation to determine the validity of the input along with the appropriate error message.

### Without Using a `<form />` Element

`useFormState` is not limited to actual forms. It can be used anywhere inputs are used.

```jsx
function LoginForm({ onSubmit }) {
  const [formState, { email, password }] = useFormState();
  return (
    <div>
      <input {...email('email')} required />
      <input {...password('password')} required minLength="8" />
      <button onClick={() => onSubmit(formState)}>Login</button>
    </div>
  );
}
```

### Labels

As a convenience, `useFormState` provides an optional API that helps with pairing a label to a specific input.

When [`formOptions.withIds`](#formoptionswithids) is enabled, a label can be paired to an [input](#input-types) by using `input.label()`. This will populate the label's `htmlFor` attribute for an input with the same parameters.

```js
const [formState, { label, text, radio }] = useFormState(initialState, {
  withIds: true, // enable automatic creation of id and htmlFor props
});

return (
  <form>
    <label {...label('name')}>Full Name</label>
    <input {...text('name')} />

    <label {...label('plan', 'free')}>Free Plan</label>
    <input {...radio('plan', 'free')} />

    <label {...label('plan', 'premium')}>Premium Plan</label>
    <input {...radio('plan', 'premium')} />
  </form>
);
```

Note that this will override any existing `id` prop if specified before calling the input functions. If you want the `id` to take precedence, it must be passed _after_ calling the input types like this:

```jsx
<input {...text('username')} id="signup-username" />
```

### Custom Controls

`useFormState` provides a `raw` type for working with controls that do not use React's [`SyntheticEvent`](https://reactjs.org/docs/events.html) system.  For example, controls like [react-select](https://react-select.com/home) or [react-datepicker](https://www.npmjs.com/package/react-datepicker) have `onChange` and `value` props that expect a custom value instead of an event.


To use this, your custom component should support an `onChange()` event which takes the value as a parameter, and a `value` prop which is expected to contain the value.  Note that if no initial value is given, the component will receive a `value` prop of an empty string, which might not be what you want. Therefore, you must provide an [initial value](#initial-state) for `raw()` inputs when working with custom controls.

```js
import DatePicker from 'react-datepicker';

function Widget() {
  const [formState, { raw }] = userFormState({ date: new Date() });
  return (
    <>
      <DatePicker {...raw('date')} />
    </>
  );
}
```

You can also provide an `onChange` option with a return value in order to map the value passed from the custom control's `onChange` to a different value in the form state.

```js
function Widget() {
  const [formState, { raw }] = userFormState({ date: new Date() });
  return (
    <>
      <DatePicker
        {...raw({
          name: 'date',
          onChange: date => date.toString();
        })}
        value={new Date(formState.date)}
      />
    </>
  );
}
```

Note that `onChange()` for a `raw` value *must* return a value.

Many raw components do not support `onBlur()` correctly.  For these components, you can use `touchOnChange` to mark a field as touched when it changes instead of on blur:

```js
function Widget() {
  const [formState, { raw }] = userFormState({ date: new Date() });
  return (
    <>
      <CustomComponent
        {...raw({
          name: 'date',
          touchOnChange: true
        })}
      />
    </>
  );
}
```

### Updating Fields Manually

There are cases where you may want to update the value of an input manually without user interaction. To do so, the `formState.setField` method can be used.

```js
function Form() {
  const [formState, { text }] = useFormState();

  function setNameField() {
    // manually setting the value of the "name" input
    formState.setField('name', 'Mary Poppins');
  }

  return (
    <>
      <input {...text('name')} readOnly />
      <button onClick={setNameField}>Set Name</button>
    </>
  )
}
```

Please note that when `formState.setField` is called, any existing errors that might have been set due to previous interactions from the user will be cleared, and both of the `validity` and the `touched` states of the input will be set to `true`.

It's also possible to set the error value for a single input using `formState.setFieldError` and to clear a single input's value _or_ resetting to its initial state if provided using `formState.clearField` and `formState.resetField` respectively.

### Resetting The From State

The form state can be cleared or reset back to its initial state if provided at any time using `formState.clear` and `formState.reset` respectively.

```js
function Form() {
  const [formState, { text, email }] = useFormState({
    email: 'hello@example.com',
  });
  return (
    <>
      <input {...text('first_name')} />
      <input {...text('last_name')} />
      <input {...email('email')} />
      <button onClick={formState.clear}>Clear All Fields</button>
      <button onClick={formState.reset}>Reset to Initial State</button>
    </>
  );
}
```

## Working with TypeScript

When working with TypeScript, the compiler needs to know what values and inputs `useFormState` is expected to be working with.

For this reason, `useFormState` accepts an optional type argument that defines the state of the form and its fields which you could use to enforce type safety.

```ts
interface LoginFormFields {
  username: string;
  password: string;
  remember_me: boolean;
}

const [formState, { text }] = useFormState<LoginFormFields>();
                                          ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
// OK
<input {...text('username')} />
formState.values.username

// Error
formState.values.doesNotExist
<input {...text('doesNotExist')} />
```

By default, `useFormState` will use the type `any` for the form state and its inputs if no type argument is provided. Therefore, it is recommended that you provide one.

By default, the `errors` property will contain strings.  If you return complex error objects from custom validation, you can provide an error type:

```ts
interface I18nError {
  en: string;
  fr: string;
}

interface LoginFormErrors {
  username?: string | I18nError;
  password?: string;
}

const [formState, { text }] = useFormState<LoginFormFields, LoginFormErrors>();

formState.errors.username; // Will be undefined, a string, or an I18nError.
```

## API

```js
import { useFormState } from 'react-use-form-state';

function FormComponent()
  const [formState, inputs] = useFormState(initialState, formOptions);
  return (
    // ...
  )
}
```

### `initialState`

`useFormState` takes an optional initial state object with keys as the name property of the form inputs, and values as the initial values of those inputs (similar to `defaultValue`/`defaultChecked`).

### `formOptions`

`useFormState` also accepts an optional form options object as a second argument with following properties:

#### `formOptions.onBlur`

A function that gets called upon any `blur` of the form's inputs. This functions provides access to the input's `blur` [`SyntheticEvent`](https://reactjs.org/docs/events.html)

```js
const [formState, inputs] = useFormState(null, {
  onBlur(e) {
    // accessing the inputs target that triggered the blur event
    const { name, value, ...target } = e.target;
  }
});
```

#### `formOptions.onChange`

A function that gets triggered upon any `change` of the form's inputs, and before updating `formState`.

This function gives you access to the input's `change` [`SyntheticEvent`](https://reactjs.org/docs/events.html), the current `formState`, the next state after the change is applied.

```js
const [formState, inputs] = useFormState(null, {
  onChange(e, stateValues, nextStateValues) {
    // accessing the actual inputs target that triggered the change event
    const { name, value, ...target } = e.target;
    // the state values prior to applying the change
    formState.values === stateValues; // true
    // the state values after applying the change
    nextStateValues;
    // the state value of the input. See Input Types below for more information.
    nextStateValues[name];
  }
});
```

#### `formOptions.onTouched`

A function that gets called after an input inside the form has lost focus, and is marked as touched. It will be called once throughout the component life cycle. This functions provides access to the input's `blur` [`SyntheticEvent`](https://reactjs.org/docs/events.html).

```js
const [formState, inputs] = useFormState(null, {
  onTouched(e) {
    // accessing the inputs target that triggered the blur event
    const { name, value, ...target } = e.target;
  }
});
```

#### `formOptions.onClear`

A function that gets called after calling `formState.clear` indicating that all fields in the form state are cleared successfully.

```js
const [formState, inputs] = useFormState(null, {
  onClear() {
    // form state was cleared successfully
  }
});

formState.clear(); // clearing the form state
```

#### `formOptions.onReset`

A function that gets called after calling `formState.reset` indicating that all fields in the form state are set to their initial values.

```js
const [formState, inputs] = useFormState(null, {
  onReset() {
    // form state was reset successfully
  }
});
 formState.reset(); // resetting the form state
```

#### `formOptions.withIds`

Indicates whether `useFormState` should generate and pass an `id` attribute to its fields. This is helpful when [working with labels](#labels-and-ids).

It can be one of the following:

A `boolean` indicating whether [input types](#input-types) should pass an `id` attribute to the inputs (set to `false` by default).

```js
const [formState, inputs] = useFormState(null, {
  withIds: true,
});
```

Or a custom id formatter: a function that gets called with the input's name and own value, and expected to return a unique string (using these parameters) that will be as the input id.

```js
const [formState, inputs] = useFormState(null, {
  withIds: (name, ownValue) =>
    ownValue ? `MyForm-${name}-${ownValue}` : `MyForm-${name}`,
});
```

Note that when `withIds` is set to `false`, applying `input.label()` will be a no-op.

### `[formState, inputs]`

The return value of `useFormState`. An array of two items, the first is the [form state](#form-state), and the second an [input types](#input-types) object.

#### Form State

The first item returned by `useFormState`.

```js
const [formState, inputs] = useFormState();
```

An object containing the form state that updates during subsequent re-renders. It also include methods to update the form state manually.

```ts
formState = {
  // an object holding the values of all input being rendered
  values: {
    [name: string]: string | string[] | boolean,
  },

  // an object indicating whether the value of each input is valid
  validity: {
    [name: string]?: boolean,
  },

  // an object holding all errors resulting from input validations
  errors: {
    [name: string]?: any,
  },

  // an object indicating whether the input was touched (focused) by the user
  touched: {
    [name: string]?: boolean,
  },

  // clears all fields in the form
  clear(): void,

  // clears the state of an input
  clearField(name: string): void,

  // resets all fields the form back to their initial state if provided
  reset(): void,

  // resets the state of an input back to its initial state if provided
  resetField(name: string): void,

  // updates the value of an input
  setField(name: string, value: string): void,

  // sets the error of an input
  setFieldError(name: string, error: string): void,
}
```

#### Input Types

The second item returned by `useFormState`.

```js
const [formState, input] = useFormState();
```

An object with keys as input types. Each type is a function that returns the appropriate props that can be spread on the corresponding input.

The following types are currently supported:

| Type and Usage                                                  | State Shape                                                                |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `<input {...input.email(name: string)} />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.color(name: string)} />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.password(name: string)} />`                   | `{ [name: string]: string }`                                               |
| `<input {...input.text(name: string)} />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.url(name: string)} />`                        | `{ [name: string]: string }`                                               |
| `<input {...input.search(name: string)} />`                     | `{ [name: string]: string }`                                               |
| `<input {...input.number(name: string)} />`                     | `{ [name: string]: string }`                                               |
| `<input {...input.range(name: string)} />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.tel(name: string)} />`                        | `{ [name: string]: string }`                                               |
| `<input {...input.radio(name: string, ownValue: string)} />`    | `{ [name: string]: string }`                                               |
| `<input {...input.checkbox(name: string, ownValue: string)} />` | `{ [name: string]: Array<string> }`                                        |
| `<input {...input.checkbox(name: string)} />`                   | `{ [name: string]: boolean }`                                              |
| `<input {...input.date(name: string)} />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.month(name: string)} />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.week(name: string)} />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.time(name: string)} />`                       | `{ [name: string]: string }`                                               |
| `<select {...input.select(name: string)} />`                    | `{ [name: string]: string }`                                               |
| `<select {...input.selectMultiple(name: string)} />`            | `{ [name: string]: Array<string> }`                                        |
| `<textarea {...input.textarea(name: string)} />`                | `{ [name: string]: string }`                                               |
| `<label {...input.label(name: string, value?: string)} />`      | N/A – `input.label()` is stateless and thus does not affect the form state |
| `<CustomControl {...input.raw(name: string)} />`                | `{ [name: string]: any }`                                                  |

#### Input Options

Alternatively, input type functions can be called with an object as the first argument. This object is used to [extend the functionality](#advanced-input-options) of the input. This includes attaching event handlers and performing input-level custom validation.

```jsx
<input
  {...input.text({
    name: 'username',
    validate: value => validateUsername(value),
    validateOnBlur: true,
  })}
/>
```

The following options can be passed:

| key                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name: string`                                                    | Required. The name of the input.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `value: string`                                                   | The input's own value. Only required by the `radio` input, and optional for the `checkbox` input.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onChange(e): void`                                               | Optional. A change event handler that gets passed the input's `change` [`SyntheticEvent`](https://reactjs.org/docs/events.html).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `onBlur(e): void`                                                 | Optional. A blur event handler that gets passed the input's `blur` [`SyntheticEvent`](https://reactjs.org/docs/events.html).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `validate(value: string, values: StateValues, event: Event): any` | Optional. An input validation function that determines whether the input value is valid. It gets passed the input value, all input values in the form, and the change/blur event (or the raw value of the control in the case of `.raw()`). The input is considered **valid** if this method returns `true` or `undefined`. Any [truthy value](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) other than `true` returned from this method will make the input **invalid**. Such values are used a **custom validation errors** that can be retrieved from [`state.errors`](#form-state). HTML5 validation rules are ignored when this function is specified. |
| `validateOnBlur: boolean`                                         | Optional. `false` by default. When set to `true` and the `validate` function is provided, the function will be called when the input loses focus. If not specified, the `validate` function will be called on value change.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `touchOnChange: boolean`                                          | Optional. `false` by default.  When `false`, the input will be marked as touched when the `onBlur()` event handler is called.  For custom controls that do not support `onBlur`, setting this to `true` will make it so inputs will be marked as touched when `onChange()` is called instead.                                                                                                                                                                                                                                                                                                                                                                           |

## License

MIT
