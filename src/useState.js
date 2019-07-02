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

  function setAll(fields, value) {
    return fields.reduce((obj, name) => Object.assign(obj, {[name]: value}), {});
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
    controls: {
      clearField,
      clear() {
        Object.keys(state.current.values).forEach(clearField);
        onClear();
      },
      setField(name, value) {
        setField(name, value, true, true);
      },
      setFields(fieldValues, options = {touched: false, validity: true}) {
        setValues(fieldValues);

        if (options) {
          const fields = Object.keys(fieldValues);

          if (options.touched !== undefined) {
            // We're setting the touched state of all fields at once:
            if (typeof options.touched === "boolean") {
              setTouched(setAll(fields, options.touched));
            } else {
              setTouched(options.touched);
            }
          }

          if (options.validity !== undefined) {
            if (typeof options.validity === "boolean") {
              // We're setting the validity of all fields at once:
              setValidity(setAll(fields, options.validity));
              if (options.validity) {
                // All fields are valid, clear the errors:
                setError(setAll(fields, undefined));
              }
            } else {
              setValidity(options.validity);

              if (options.errors === undefined) {
                // Clear the errors for valid fields:
                const errorFields = Object.entries(options.validity).reduce((errorsObj, [name, isValid]) => {
                  if (isValid) {
                    return Object.assign({}, errorsObj || {}, {[name]: undefined});
                  }
                  return errorsObj;
                }, null);

                if (errorFields) {
                  setError(errorFields);
                }
              }
            }
          }

          if (options.errors) {
            // Not logical to set the same error for all fields so has to be an object.
            setError(options.errors);

            if (options.validity === undefined) {
              // Fields with errors are not valid:
              setValidity(setAll(Object.keys(options.errors), false));
            }
          }
        }

      },
      setFieldError(name, error) {
        setValidity({ [name]: false });
        setError({ [name]: error });
      },
    },
  };
}
