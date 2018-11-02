import { useReducer } from 'react';
import stateReducer from './stateReducer';
import { TYPES, SELECT, CHECKBOX, RADIO } from './constants';

export default function useFormState(initialState) {
  const [values, setFormState] = useReducer(stateReducer, initialState || {});
  const [touched, setTouchedState] = useReducer(stateReducer, {});
  const [validity, setValidityState] = useReducer(stateReducer, {});

  const createPropsGetter = type => (name, ownValue) => {
    const hasOwnValue = !!ownValue;
    const hasValueInState = values[name] !== undefined;
    const isCheckbox = type === CHECKBOX;
    const isRadio = type === RADIO;

    const setInitialValue = () => {
      let value = '';
      if (isCheckbox) {
        /**
         * If a checkbox has a user-defined value, its value the form state
         * value will be an array. Otherwise it will be considered a toggle.
         */
        value = hasOwnValue ? [] : false;
      }
      setFormState({ [name]: value });
    };

    const inputProps = {
      name,
      get type() {
        if (type !== SELECT) {
          return type;
        }
      },
      get checked() {
        if (isCheckbox) {
          if (hasOwnValue) {
            /**
             * @todo Handle the case where two checkbox inputs share the same
             * name, but one has a value, the other doesn't (throws currently).
             * <input {...input.checkbox('option1')} />
             * <input {...input.checkbox('option1', 'value_of_option1')} />
             */
            return hasValueInState ? values[name].includes(ownValue) : false;
          }
          return values[name] || false;
        }
        if (isRadio) {
          return values[name] === ownValue;
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
        return hasValueInState ? values[name] : '';
      },
      onChange(e) {
        const { value: targetValue, checked } = e.target;
        let inputValue = targetValue;
        if (isCheckbox) {
          if (!hasOwnValue) {
            inputValue = checked;
          } else {
            const checkedValues = new Set(values[name]);
            if (checked) {
              checkedValues.add(inputValue);
            } else {
              checkedValues.delete(inputValue);
            }
            inputValue = Array.from(checkedValues);
          }
        }
        setFormState({ [name]: inputValue });
      },
      onBlur(e) {
        setTouchedState({ [name]: true });
        setValidityState({ [name]: e.target.validity.valid });
      },
    };
    return inputProps;
  };

  const typeMethods = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  return [{ values, touched, validity }, typeMethods];
}
