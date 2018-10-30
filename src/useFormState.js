import { useReducer } from 'react';
import reducer from './stateReducer';

export default function useFormState(initialState) {
  const [formState, setFormState] = useReducer(reducer, initialState || {});
  const [touchedState, setTouchedState] = useReducer(reducer, {});
  const [validityState, setValidityState] = useReducer(reducer, {});

  const getInputProps = type => (name, value) => ({
    name,
    get type() {
      if (type !== 'select') {
        return type;
      }
    },
    onChange(e) {
      let { value: inputValue } = e.target;
      if (type === 'checkbox') {
        const values = new Set(formState[name]);
        if (values.has(inputValue)) {
          values.delete(inputValue);
        } else {
          values.add(inputValue);
        }
        inputValue = Array.from(values);
      }
      if (['range', 'number'].includes(type)) {
        inputValue = parseInt(inputValue, 10);
      }
      setFormState({ [name]: inputValue });
    },
    get value() {
      if (formState[name] === undefined) {
        setFormState({ [name]: type === 'checkbox' ? [] : '' });
      }
      if (type === 'checkbox' || type === 'radio') {
        return value;
      }
      return formState[name] !== undefined ? formState[name] : '';
    },
    get checked() {
      if (type === 'checkbox') {
        if (formState[name]) {
          return formState[name].includes(value);
        }
        return false;
      }
      if (['radio'].includes(type)) {
        return formState[name] === value;
      }
    },
    onBlur(e) {
      setTouchedState({ [name]: true });
      setValidityState({ [name]: e.target.validity.valid });
    },
  });

  const typeProxyHandler = {
    get(target, typeName) {
      return getInputProps(typeName);
    },
  };

  return [
    { values: formState, touched: touchedState, validity: validityState },
    new Proxy({}, typeProxyHandler),
  ];
}
