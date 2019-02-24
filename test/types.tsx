import React from 'react';
import { useFormState } from '../src';

useFormState();
useFormState({});
useFormState(null);

const initialState = {
  username: 'wsmd',
  colors: ['yellow', 'red'],
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

formState.touched.colors;
formState.validity.username;

formState.values.username;
formState.values.colors.forEach(color => console.log(color));

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
