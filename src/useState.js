import { useReducer, useRef } from 'react';
import { isFunction, isEqual } from './utils';
import { useCache } from './useCache';

function stateReducer(state, newState) {
  return isFunction(newState) ? newState(state) : { ...state, ...newState };
}

export function useState({ initialState }) {
  const state = useRef();
  const initialValues = useCache();
  const comparators = useCache();
  const [values, setValues] = useReducer(stateReducer, initialState || {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});
  const [errors, setError] = useReducer(stateReducer, {});
  const [pristine, setPristine] = useReducer(stateReducer, {});

  state.current = { values, touched, validity, errors, pristine };

  function getInitialValue(name) {
    return initialValues.has(name)
      ? initialValues.get(name)
      : initialState[name];
  }

  function updatePristine(name, value) {
    let comparator = comparators.get(name);
    // If comparator isn't available for an input, that means the input wasn't
    // mounted, or manually added via setField.
    comparator = isFunction(comparator) ? comparator : isEqual;
    setPristine({ [name]: !!comparator(getInitialValue(name), value) });
  }

  function setFieldState(name, value, inputValidity, inputTouched, inputError) {
    setValues({ [name]: value });
    setTouched({ [name]: inputTouched });
    setValidity({ [name]: inputValidity });
    setError({ [name]: inputError });
    updatePristine(name, value);
  }

  function setField(name, value) {
    // need to store the initial value via setField in case it's before the
    // input of the given name is rendered.
    if (!initialValues.has(name)) {
      initialValues.set(name, value);
    }
    setFieldState(name, value, true, true);
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
    comparators,
  };
}
