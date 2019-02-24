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
  - [Without Using a `<form />` Element](#without-using-a-form--element)
- [API](#api)
  - [`initialState`](#initialstate)
  - [`formOptions`](#formoptions)
    - [`formOptions.onBlur`](#formoptionsonblur)
    - [`formOptions.onChange`](#formoptionsonchange)
    - [`formOptions.onTouched`](#formoptionsontouched)
  - [`[formState, input]`](#formstate-input)
    - [Form State](#form-state)
    - [Input Types](#input-types)
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

### Without Using a `<form />` Element

`react-use-form-state` is not limited to actual forms. It can be used anywhere inputs are used.

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


## API

```js
import { useFormState } from 'react-use-form-state';

function FormComponent()
  const [formState, input] = useFormState(initialState, formOptions);
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

### `[formState, input]`

The return value of `useFormState`. An array of two items, the first is the [form state](#form-state), and the second an [input types](#input-types) object.

#### Form State

The first item returned by `useFormState`.

```js
const [formState, input] = useFormState()
```

An object describing the form state that updates during subsequent re-renders.

Form state consists of three nested objects:

- `values`: an object holding the state of each input being rendered.
- `validity`: an object indicating whether the value of each input is valid.
- `touched`: an object indicating whether the input was touched (focused) by the user.

```ts
formState = {
  values: {
    [inputName: string]: string | string[],
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
const [formState, input] = useFormState()
```

An object with keys as input types. Each type is a function that returns the appropriate props that can be spread on the corresponding input.

The following types are currently supported:

| Type and Usage                                              | State Shape                         |
| ----------------------------------------------------------- | ----------------------------------- |
| `<input {...input.email(name: string) />`                   | `{ [name: string]: string }`        |
| `<input {...input.color(name: string) />`                   | `{ [name: string]: string }`        |
| `<input {...input.password(name: string) />`                | `{ [name: string]: string }`        |
| `<input {...input.text(name: string) />`                    | `{ [name: string]: string }`        |
| `<input {...input.url(name: string) />`                     | `{ [name: string]: string }`        |
| `<input {...input.search(name: string) />`                  | `{ [name: string]: string }`        |
| `<input {...input.number(name: string) />`                  | `{ [name: string]: string }`        |
| `<input {...input.range(name: string) />`                   | `{ [name: string]: string }`        |
| `<input {...input.tel(name: string) />`                     | `{ [name: string]: string }`        |
| `<input {...input.radio(name: string, value: string) />`    | `{ [name: string]: string }`        |
| `<input {...input.checkbox(name: string, value: string) />` | `{ [name: string]: Array<string> }` |
| `<input {...input.checkbox(name: string) />`                | `{ [name: string]: boolean }`       |
| `<input {...input.date(name: string) />`                    | `{ [name: string]: string }`        |
| `<input {...input.month(name: string) />`                   | `{ [name: string]: string }`        |
| `<input {...input.week(name: string) />`                    | `{ [name: string]: string }`        |
| `<input {...input.time(name: string) />`                    | `{ [name: string]: string }`        |
| `<select {...input.select(name: string) />`                 | `{ [name: string]: string }`        |
| `<select {...input.selectMultiple(name: string) />`         | `{ [name: string]: Array<string> }` |
| `<textarea {...input.textarea(name: string) />`             | `{ [name: string]: string }`        |


## License

MIT
