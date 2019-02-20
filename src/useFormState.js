import { useReducer } from 'react';
import stateReducer from './stateReducer';
import {
  ID_PREFIX,
  TYPES,
  SELECT,
  CHECKBOX,
  RADIO,
  TEXTAREA,
  LABEL,
  ID,
} from './constants';

const idGetter = (name, value) =>
  [ID_PREFIX, name, value].filter(part => !!part).join('__');

const labelPropsGetter = (...args) => ({
  htmlFor: idGetter(...args),
});

export default function useFormState(initialState) {
  const [state, setState] = useReducer(stateReducer, initialState || {});
  const [touched, setTouchedState] = useReducer(stateReducer, {});
  const [validity, setValidityState] = useReducer(stateReducer, {});

  const createPropsGetter = type => (name, ownValue) => {
    const hasOwnValue = !!ownValue;
    const hasValueInState = state[name] !== undefined;
    const isCheckbox = type === CHECKBOX;
    const isRadio = type === RADIO;

    function setInitialValue() {
      let value = '';
      if (isCheckbox) {
        /**
         * If a checkbox has a user-defined value, its value the form state
         * value will be an array. Otherwise it will be considered a toggle.
         */
        value = hasOwnValue ? [] : false;
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

    const inputProps = {
      name,
      id: idGetter(name, ownValue),
      get type() {
        if (type !== SELECT && type !== TEXTAREA) return type;
      },
      get checked() {
        if (isRadio) {
          return state[name] === ownValue;
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
          return hasValueInState ? state[name].includes(ownValue) : false;
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
          return ownValue;
        }
        return hasValueInState ? state[name] : '';
      },
      onChange(e) {
        let { value } = e.target;
        if (isCheckbox) {
          value = getNextCheckboxValue(e);
        }
        setState({ [name]: value });
      },
      onBlur(e) {
        setTouchedState({ [name]: true });
        setValidityState({ [name]: e.target.validity.valid });
      },
    };

    return inputProps;
  };

  const inputPropsCreators = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  const otherCreators = {
    [LABEL]: labelPropsGetter,
    [ID]: idGetter,
  };

  return [
    { values: state, validity, touched },
    { ...inputPropsCreators, ...otherCreators },
  ];
}
