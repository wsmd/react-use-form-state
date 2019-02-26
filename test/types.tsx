import React from 'react';
import { useFormState } from '../src';

useFormState();
useFormState({});
useFormState(null);

const initialState = {
  username: 'wsmd',
  colors: ['yellow', 'red'],
  power_level: 9000,
  remember_me: true,
};

const [formState, input] = useFormState(initialState, {
  onChange(e, stateValues, nextStateValues) {
    const { name, value } = e.target;
    if (name === 'username') {
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
});

let username: string = formState.values.username;

formState.values.colors.forEach(color => console.log(color));

/**
 * Even though we're accepting a number as a default value for numeric inputs
 * (e.g. type=number and type=range), the value we store in state will be a string
 */
let level: string = formState.values.power_level;

/**
 * values of validity and touched will be determined via the blur event. Until
 * the even is fired, the values will be of type undefined
 */
formState.touched.colors;
formState.validity.username;

<input {...input.checkbox('name', 'value')} />;
<input {...input.color('name')} />;
<input {...input.date('name')} />;
<input {...input.email('name')} />;
<input {...input.month('name')} />;
<input {...input.number('name')} />;
<input {...input.password('name')} />;
<input {...input.radio('name', 'value')} />;
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

// typed state

interface ConnectFormState {
  user: string;
  host: string;
  password: string;
  database: string;
  port: number;
}

const [typedState] = useFormState<ConnectFormState>();

const { port, host }: { port: string; host: string } = typedState.values;
