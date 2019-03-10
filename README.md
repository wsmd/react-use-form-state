<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/47732577-e00e9280-dc3c-11e8-9f2f-dd290b29fd35.png" width="128">
  <br>
  react-use-form-state
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-use-form-state">
    <img src="https://img.shields.io/npm/v/react-use-form-state.svg" alt="Current Release" />
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
  - [Without Using a `<form />` Element](#without-using-a-form--element)
  - [Labels and Ids](#labels-and-ids)
- [Working with TypeScript](#working-with-typescript)
- [API](#api)
  - [`initialState`](#initialstate)
  - [`formOptions`](#formoptions)
    - [`formOptions.onBlur`](#formoptionsonblur)
    - [`formOptions.onChange`](#formoptionsonchange)
    - [`formOptions.onTouched`](#formoptionsontouched)
    - [`formOptions.inputIds`](#formoptionsinputids)
  - [`[formState, inputs]`](#formstate-inputs)
    - [Form State](#form-state)
    - [Input Types](#input-types)
    - [Input Options](#input-options)
- [License](#license)

</p>
</details>

## Motivation

Managing form state in React can be a bit unwieldy sometimes. There are [plenty of great solutions](https://www.npmjs.com/search?q=react%20forms&ranking=popularity) already available that make managing forms state a breeze. However, many of those solutions are opinionated, packed with tons of features that may end up not being used, and/or requires shipping a few extra bytes!

Luckily, the recent introduction of [React Hooks](https://reactjs.org/docs/hooks-intro.html), and the ability to write custom ones have enabled new possibilities when it comes sharing state logic. Forms state is no expectation!

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

export default function SignUpForm() {
  const [formState, { text, email, password, radio }] = useFormState();
  return (
    <form onSubmit={() => console.log(formState)}>
      <input {...text('name')} />
      <input {...email('email')} required />
      <input {...password('password')} required minLength="8" />
      <input {...radio('plan', 'free')} />
      <input {...radio('plan', 'premium')} />
    </form>
  );
}
```

From the example above, as the user fills in the form, `formState` will look something like this:

```js
{
  "values": {
    "name": "Mary Poppins",
    "email": "mary@example.com",
    "password": "1234",
    "plan": "free",
  },
  "validity": {
    "name": true,
    "email": true,
    "password": false,
    "plan": true,
  },
  "touched": {
    "name": true,
    "email": true,
    "password": true,
    "plan": true,
  }
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

`useFormState` provides a quick and simple API to get started with building a from and managing its state. It also supports [HTML5 from validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) out of the box.

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
          validateOnBlur: true,
          validate: (value, values) =>
            !value.includes(values.username) &&
            STRONG_PASSWORD_REGEX.test(value),
        })}
      />
    </>
  );
};
```

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
### Labels and Ids

A label can be paired to a specific input by passing the same parameters to
`input.label()`. This will populate the label's `htmlFor` attribute.

```js
const [formState, { label, text, radio }] = useFormState();

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

An input's generated ID can also be queried with the `id` getter.

```jsx
const [formState, { id, text }] = useFormState();

return (
  <>
    <input {...text('name')} />
    <p>The input's ID is {id('name')}</p>
  </>
);
```

By default, calls to [inputs types](#input-types) will generate and pass an `id` prop to the input itself using its name and own value.

Note that this will override the `id` prop if specified before calling the input functions. If you want the `id` to take precedence, it must be passed _after_ calling the input types like this:

```jsx
<input {...text('username')} id="signup-username" />
```

To disable the automatic creation of ids or customize their format, see [`formOptions.inputIds`](#formoptionsinputids).

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

## API

```js
import { useFormState } from 'react-use-form-state';

function FormComponent()
  const [formState, inputs] = useFormState(initialState, formOptions);
  // ...
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

A function that gets called after an input inside the form has lost focus, and marked as touched. It will be called once throughout the component life cycle. This functions provides access to the input's `blur` [`SyntheticEvent`](https://reactjs.org/docs/events.html).

```js
const [formState, inputs] = useFormState(null, {
  onTouched(e) {
    // accessing the inputs target that triggered the blur event
    const { name, value, ...target } = e.target;
  }
});
```

#### `formOptions.inputIds`

One of the following:

`boolean` indicating whether [input types](#input-types) should create an `id` attribute on inputs (defaults to `true`).

```js
const [formState, inputs] = useFormState(null, {
  // disables creating input ids
  inputIds: false,
});
```

Or a custom id formatter: a function that gets called with the input's name and own value, and expected to return a unique string (using these parameters) that will be as the input id.

```js
const [formState, inputs] = useFormState(null, {
 // custom id formatter
  inputIds: (name, ownValue) =>
    ownValue ? `MyForm-${name}-${ownValue}` : `MyForm-${name}`,
});
```

Note that when `inputIds` is set to `false`, calls to `input.label` and `input.id` will be a no-op.

### `[formState, inputs]`

The return value of `useFormState`. An array of two items, the first is the [form state](#form-state), and the second an [input types](#input-types) object.

#### Form State

The first item returned by `useFormState`.

```js
const [formState, inputs] = useFormState();
```

An object describing the form state that updates during subsequent re-renders.

Form state consists of three nested objects:

- `values`: an object holding the state of each input being rendered.
- `validity`: an object indicating whether the value of each input is valid.
- `touched`: an object indicating whether the input was touched (focused) by the user.

```ts
formState = {
  values: {
    [inputName: string]: string | string[] | boolean,
  },
  validity: {
    [inputName: string]: boolean,
  },
  touched: {
    [inputName: string]: boolean,
  },
}
```

#### Input Types

The second item returned by `useFormState`.

```js
const [formState, inputs] = useFormState();
```

An object with keys as input types. Each type is a function that returns the appropriate props that can be spread on the corresponding input.

The following types are currently supported:

| Type and Usage                                                 | State Shape                                                                |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `<input {...input.email(name: string) />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.color(name: string) />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.password(name: string) />`                   | `{ [name: string]: string }`                                               |
| `<input {...input.text(name: string) />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.url(name: string) />`                        | `{ [name: string]: string }`                                               |
| `<input {...input.search(name: string) />`                     | `{ [name: string]: string }`                                               |
| `<input {...input.number(name: string) />`                     | `{ [name: string]: string }`                                               |
| `<input {...input.range(name: string) />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.tel(name: string) />`                        | `{ [name: string]: string }`                                               |
| `<input {...input.radio(name: string, ownValue: string) />`    | `{ [name: string]: string }`                                               |
| `<input {...input.checkbox(name: string, ownValue: string) />` | `{ [name: string]: Array<string> }`                                        |
| `<input {...input.checkbox(name: string) />`                   | `{ [name: string]: boolean }`                                              |
| `<input {...input.date(name: string) />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.month(name: string) />`                      | `{ [name: string]: string }`                                               |
| `<input {...input.week(name: string) />`                       | `{ [name: string]: string }`                                               |
| `<input {...input.time(name: string) />`                       | `{ [name: string]: string }`                                               |
| `<select {...input.select(name: string) />`                    | `{ [name: string]: string }`                                               |
| `<select {...input.selectMultiple(name: string) />`            | `{ [name: string]: Array<string> }`                                        |
| `<textarea {...input.textarea(name: string) />`                | `{ [name: string]: string }`                                               |
| `<label {...input.label(name: string, value?: string)} />`     | N/A – `input.label()` is stateless and thus does not affect the form state |

#### Input Options

Alternatively, input type functions can be called with an object as the first argument. This object is used to [extend the functionality](#advanced-input-options) of the input. This includes attaching event handlers and performing input-level custom validation.

```jsx
<input
  {...text({
    name: 'username',
    validate: value => validateUsername(value),
    validateOnBlur: true,
  })}
/>
```

The following options can be passed:

| key                                                     | Description                                                                                                                                                                                                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name: string`                                          | Required. The name of the input.                                                                                                                                                                                                                                |
| `value: string`                                         | The input's own value. Only required by the `radio` input, and optional for the `checkbox` input.                                                                                                                                                               |
| `onChange(e): void`                                     | Optional. A change event handler that gets passed the input's `change` [`SyntheticEvent`](https://reactjs.org/docs/events.html).                                                                                                                                |
| `onBlur(e): void`                                       | Optional. A blur event handler that gets passed the input's `blur` [`SyntheticEvent`](https://reactjs.org/docs/events.html).                                                                                                                                    |
| `validate(value: string, values: StateValues): boolean` | Optional. An input validation function that gets passed the input value and all input values in the state. It's expected to return a boolean indicating whether the input's value is valid. HTML5 validation rules are ignored when this function is specified. |
| `validateOnBlur: boolean`                               | Optional. `false` by default. When set to `true` and the `validate` function is provided, the function will be called when the input loses focus. If not specified, the `validate` function will be called on value change.                                     |

## License

MIT
