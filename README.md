<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/47685882-ad1dbd80-dbae-11e8-97b1-453f80d79844.png" width="128">
  <br>
  react-use-form-state
</h1>
<h6 align="center">⚠️ This is a working proof-of-concept, and still under active development ⚠️</h6>

## Why?

Managing form state in React can be a bit unwieldy sometimes. There are a [plenty of great solutions](https://www.npmjs.com/search?q=react%20forms&ranking=popularity) already available that make managing forms state a breeze. However, many of those solutions are opinionated, packed with a ton of features that might not be used, and/or requires shipping a few extra bytes!

Luckily, the recent introduction of [React Hooks](https://reactjs.org/docs/hooks-intro.html) and the ability to write custom hooks have opened a lot of doors for sharing state logic. Forms state is no expectation!

`react-use-form-state` is a small React Hook that attempts to [simplify managing forms state](#example), using the native form input elements you are familiar with!

## Installation

`react-use-form-state` requires a peer dependency of `react@16.7.0.alpha.0` or above.

```
npm install react@16.7.0-alpha.0 react-dom@16.7.0-alpha.0
```

#### Using NPM

```
npm install react-use-form-state
```

#### Using Yarn

```
yarn add react-use-form-state
```

## API

WIP

## Examples

> _Warning: This is an experimental API and it is likely to break in a future release. Use with caution!_

### Basic Usage

```jsx
import { useFormState } from 'react-use-form-state';

export default function App() {
  const [formState, input] = useFormState(/* initial state */);
  return (
    <form onSubmit={() => console.log(formState)}>
      {/* Text */}
      <input {...input.text('name')} required />
      <input {...input.email('email')} required />
      <input {...input.password('password')} required minLength="8" />

      {/* Date and Time */}
      <input {...input.date('departure-date')} />
      <input {...input.date('return-date')} />

      {/* Checkboxes */}
      <input {...input.checkbox('extra', 'hotel')} />
      <input {...input.checkbox('extra', 'car')} />

      {/* Radio Buttons */}
      <input {...input.radio('trip', 'round-trip')} />
      <input {...input.radio('trip', 'one-way')} />

      {/* Number and Range */}
      <input {...input.number('travelers')} />
      <input {...input.range('min-price')} />
      <input {...input.range('max-price')} />

      {/* Select */}
      <select {...input.select('cabin')}>
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="first">First</option>
      </select>
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
    "password": "abcd",
    "departure-date": "2018-10-09",
    "return-date": "2018-11-14",
    "extra": ["car"],
    "trip": "one-way",
    "travelers": 2,
    "min-price": 0,
    "max-price": 100,
    "cabin": "business"
  },
  "validity": {
    "name": true,
    "email": true,
    "password": false,
    /* etc */
  },
  "touched": {
    "name": true,
    "email": true,
    "password": false,
    /* etc */
  }
}
```

## License

MIT
