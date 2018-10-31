import { useReducer } from 'react';
import stateReducer from './stateReducer';
import { TYPES, SELECT, CHECKBOX, RADIO } from './constants';

export default function useFormState(initialState) {
  const [values, setFormState] = useReducer(stateReducer, initialState || {});
  const [touched, setTouchedState] = useReducer(stateReducer, {});
  const [validity, setValidityState] = useReducer(stateReducer, {});

  const createPropsGetter = type => (name, value) => {
    const hasValue = values[name] !== undefined;
    const inputProps = {
      name,
      get type() {
        if (type !== SELECT) {
          return type;
        }
      },
      get checked() {
        if (type === CHECKBOX) {
          return hasValue ? values[name].includes(value) : false;
        }
        if (type === RADIO) {
          return values[name] === value;
        }
      },
      get value() {
        // populating values of the form state on first render
        if (!hasValue) {
          setFormState({ [name]: type === CHECKBOX ? [] : '' });
        }
        if (type === CHECKBOX || type === RADIO) {
          return value;
        }
        if (hasValue) {
          return values[name];
        }
        return '';
      },
      onChange(e) {
        const { value: targetValue, checked } = e.target;
        let inputValue = targetValue;
        if (type === CHECKBOX) {
          const checkedValues = new Set(values[name]);
          if (checked) {
            checkedValues.add(inputValue);
          } else {
            checkedValues.delete(inputValue);
          }
          inputValue = Array.from(checkedValues);
        }
        setFormState({ [name]: inputValue });
      },
      onBlur(e) {
        setTouchedState({ [name]: true });
        setValidityState({ [name]: e.target.validity.valid });
      },
    };
    return inputProps;
  };

  const typeMethods = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  return [{ values, touched, validity }, typeMethods];
}
