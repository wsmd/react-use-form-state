import { useReducer, useRef } from 'react';
import { isFunction } from './utils';
import { useCache } from './useCache';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState, onReset, onClear }) {
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

  const resetField = name => setField(name, initialValues.get(name));
  const clearField = name => setField(name);

  function forEach(callback) {
    Object.keys(state.current.values).forEach(callback);
  }

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
        forEach(clearField);
        onClear();
      },
      reset() {
        forEach(resetField);
        onReset();
      },
      setField(name, value) {
        setField(name, value, true, true);
      },
    },
  };
}
