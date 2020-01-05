import { useReducer, useRef } from 'react';
import { isFunction, getOr } from './utils';
import { useCache } from './useCache';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState }) {
  const state = useRef();
  const initialValues = useCache();
  const [values, setValues] = useReducer(stateReducer, initialState || {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});
  const [errors, setError] = useReducer(stateReducer, {});
  const [pristine, setPristine] = useReducer(stateReducer, {});

  state.current = { values, touched, validity, errors, pristine };

  function getInitialValue(name) {
    return initialValues.has(name)
      ? initialValues.get(name)
      : getOr(initialState, state.current.values)[name];
  }

  function updatePristine(name, value, comparator) {
    const initialValue = getInitialValue(name);
    setPristine({ [name]: !!comparator(initialValue, value) });
  }

  function setFieldState(field) {
    setError({ [field.name]: field.error });
    setValues({ [field.name]: field.value });
    setTouched({ [field.name]: getOr(field.touched, true) });
    setValidity({ [field.name]: getOr(field.validity, true) });
    setPristine({ [field.name]: getOr(field.pristine, true) });
  }

  function setField(name, value) {
    setFieldState(typeof name === 'object' ? name : { name, value });
  }

  function clearField(name) {
    setField(name);
  }

  function resetField(name) {
    setField(name, getInitialValue(name));
  }

  function isPristine() {
    return Object.keys(state.current.pristine).every(
      key => !!state.current.pristine[key],
    );
  }

  function forEach(cb) {
    Object.keys(state.current.values).forEach(cb);
  }

  return {
    get current() {
      return state.current;
    },
    setValues,
    setTouched,
    setValidity,
    setError,
    setField,
    setPristine,
    updatePristine,
    initialValues,
    resetField,
    clearField,
    forEach,
    isPristine,
  };
}
