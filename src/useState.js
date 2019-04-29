import { useReducer, useRef } from 'react';
import { isFunction } from './utils';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState }) {
  const [values, setValues] = useReducer(stateReducer, initialState || {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});
  const [errors, setError] = useReducer(stateReducer, {});

  const state = useRef();
  state.current = { values, touched, validity, errors };

  return {
    /**
     * @type {{ values, touched, current, errors }}
     */
    get current() {
      return state.current;
    },
    setValues,
    setTouched,
    setValidity,
    setError,
    updateInput(name, value, inputValidity, inputTouched, inputError) {
      setValues({ [name]: value });
      setTouched({ [name]: inputTouched });
      setValidity({ [name]: inputValidity });
      setError({ [name]: inputError });
    },
    forEach(callback) {
      Object.keys(state.current.values).forEach(callback);
    },
  };
}
