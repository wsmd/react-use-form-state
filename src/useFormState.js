import { useReducer } from 'react';
import { stateReducer } from './stateReducer';
import { toString } from './toString';
import { parseInputArgs } from './parseInputArgs';
import {
  TYPES,
  SELECT,
  CHECKBOX,
  RADIO,
  TEXTAREA,
  SELECT_MULTIPLE,
} from './constants';

function noop() {}

const defaultFromOptions = {
  onChange: noop,
  onBlur: noop,
  onTouched: noop,
};

export default function useFormState(initialState, options) {
  const formOptions = { ...defaultFromOptions, ...options };

  const [state, setState] = useReducer(stateReducer, initialState || {});
  const [touched, setTouchedState] = useReducer(stateReducer, {});
  const [validity, setValidityState] = useReducer(stateReducer, {});

  const createPropsGetter = type => (...args) => {
    const { name, ownValue, ...inputOptions } = parseInputArgs(args);

    const hasOwnValue = !!toString(ownValue);
    const hasValueInState = state[name] !== undefined;
    const isCheckbox = type === CHECKBOX;
    const isRadio = type === RADIO;
    const isSelectMultiple = type === SELECT_MULTIPLE;

    function setInitialValue() {
      let value = '';
      if (isCheckbox) {
        /**
         * If a checkbox has a user-defined value, its value the form state
         * value will be an array. Otherwise it will be considered a toggle.
         */
        value = hasOwnValue ? [] : false;
      }
      if (isSelectMultiple) {
        value = [];
      }
      setState({ [name]: value });
    }

    function getNextCheckboxValue(e) {
      const { value, checked } = e.target;
      if (!hasOwnValue) {
        return checked;
      }
      const checkedValues = new Set(state[name]);
      if (checked) {
        checkedValues.add(value);
      } else {
        checkedValues.delete(value);
      }
      return Array.from(checkedValues);
    }

    function getNextSelectMultipleValue(e) {
      return Array.from(e.target.options).reduce(
        (values, option) =>
          option.selected ? [...values, option.value] : values,
        [],
      );
    }

    const inputProps = {
      name,
      get type() {
        if (type !== SELECT && type !== SELECT_MULTIPLE && type !== TEXTAREA)
          return type;
      },
      get multiple() {
        if (type === SELECT_MULTIPLE) return true;
      },
      get checked() {
        if (isRadio) {
          return state[name] === toString(ownValue);
        }
        if (isCheckbox) {
          if (!hasOwnValue) {
            return state[name] || false;
          }
          /**
           * @todo Handle the case where two checkbox inputs share the same
           * name, but one has a value, the other doesn't (throws currently).
           * <input {...input.checkbox('option1')} />
           * <input {...input.checkbox('option1', 'value_of_option1')} />
           */
          return hasValueInState
            ? state[name].includes(toString(ownValue))
            : false;
        }
      },
      get value() {
        // auto populating initial state values on first render
        if (!hasValueInState) {
          setInitialValue();
        }
        /**
         * Since checkbox and radio inputs have their own user-defined values,
         * and since checkbox inputs can be either an array or a boolean,
         * returning the value of input from the current form state is illogical
         */
        if (isCheckbox || isRadio) {
          return toString(ownValue);
        }
        return hasValueInState ? state[name] : '';
      },
      onChange(e) {
        let { value } = e.target;
        if (isCheckbox) {
          value = getNextCheckboxValue(e);
        }
        if (isSelectMultiple) {
          value = getNextSelectMultipleValue(e);
        }

        const partialNewState = { [name]: value };
        const newState = { ...state, ...partialNewState };

        formOptions.onChange(e, state, newState);
        inputOptions.onChange(e);

        setState(partialNewState);
      },
      onBlur(e) {
        if (!touched[name]) {
          formOptions.onTouched(e);
        }

        inputOptions.onBlur(e);
        formOptions.onBlur(e);

        let isValid = e.target.validity.valid;
        if (typeof inputOptions.validate === 'function') {
          isValid = inputOptions.validate(e.target.value);
        }

        setTouchedState({ [name]: true });
        setValidityState({ [name]: isValid });
      },
    };

    return inputProps;
  };

  const inputPropsCreators = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  return [{ values: state, validity, touched }, inputPropsCreators];
}
