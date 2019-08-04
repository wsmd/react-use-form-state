import { useReducer, useRef } from 'react';
import { isFunction } from './utils';
import { useCache } from './useCache';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState, onClear, onReset }) {
  const state = useRef();
  const initialValues = useCache();
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
  const resetField = name => setField(name, initialValues.get(name));

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
    initialValues,
    controls: {
      clearField,
      resetField,
      clear() {
        Object.keys(state.current.values).forEach(clearField);
        onClear();
      },
      reset() {
        Object.keys(state.current.values).forEach(resetField);
        onReset();
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
