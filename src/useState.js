import { useReducer, useRef } from 'react';

function stateReducer(state, newState) {
  return { ...state, ...newState };
}

export function useState({ initialState }) {
  const [values, setValues] = useReducer(stateReducer, initialState || {});
  const [touched, setTouched] = useReducer(stateReducer, {});
  const [validity, setValidity] = useReducer(stateReducer, {});

  const state = useRef();
  state.current = { values, touched, validity };

  return {
    /**
     * @type {{ values, touched, current }}
     */
    get current() {
      return state.current;
    },
    setValues,
    setTouched,
    setValidity,
  };
}
