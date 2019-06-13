import { useReducer, useRef } from 'react';
import { isFunction } from './utils';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState, onClear }) {
  const state = useRef();
  const [values, setValues] = useReducer(stateReducer, initialState || {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});
  const [errors, setError] = useReducer(stateReducer, {});

  state.current = { values, touched, validity, errors };

  function setField(name, value, inputValidity, inputTouched, inputError) {
    setValues({ [name]: value });
    setTouched({ [name]: inputTouched });
    setValidity({ [name]: inputValidity });
    setError({ [name]: inputError });
  }

  const clearField = name => setField(name);

  return {
    /**
     * @type {{ values, touched, validity, errors }}
     */
    get current() {
      return state.current;
    },
    setValues,
    setTouched,
    setValidity,
    setError,
    controls: {
      clearField,
      clear() {
        Object.keys(state.current.values).forEach(clearField);
        onClear();
      },
      setField(name, value) {
        setField(name, value, true, true);
      },
      setFieldError(name, error) {
        setValidity({ [name]: false });
        setError({ [name]: error });
      },
    },
  };
}
