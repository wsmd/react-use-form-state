import { useReducer } from 'react';
import { stateReducer } from './stateReducer';
import { toString } from './toString';
import { parseInputArgs } from './parseInputArgs';
import { useInputId } from './useInputId';
import { useMarkAsDirty } from './useMarkAsDirty';
import {
  TYPES,
  SELECT,
  CHECKBOX,
  RADIO,
  TEXTAREA,
  SELECT_MULTIPLE,
  LABEL,
} from './constants';

function noop() {}

const defaultFromOptions = {
  onChange: noop,
  onBlur: noop,
  onTouched: noop,
  onSubmit: noop,
  onReset: noop,
  withIds: false,
};

export default function useFormState(initialState, options) {
  const formOptions = { ...defaultFromOptions, ...options };

  const [state, setState] = useReducer(stateReducer, initialState || {});
  const [touched, setTouchedState] = useReducer(stateReducer, {});
  const [validity, setValidityState] = useReducer(stateReducer, {});

  const { getIdProp } = useInputId(formOptions.withIds);
  const { setDirty, isDirty } = useMarkAsDirty();

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

    function getValidationResult(e, values = state) {
      if (typeof inputOptions.validate === 'function') {
        return !!inputOptions.validate(e.target.value, values);
      }
      return e.target.validity.valid;
    }

    const inputProps = {
      name,
      get type() {
        if (type !== SELECT && type !== SELECT_MULTIPLE && type !== TEXTAREA) {
          return type;
        }
      },
      get multiple() {
        if (type === SELECT_MULTIPLE) {
          return true;
        }
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
        setDirty(name, true);
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

        if (!inputOptions.validateOnBlur) {
          setValidityState({ [name]: getValidationResult(e, newState) });
        }

        setState(partialNewState);
      },
      onBlur(e) {
        if (!touched[name]) {
          setTouchedState({ [name]: true });
          formOptions.onTouched(e);
        }

        inputOptions.onBlur(e);
        formOptions.onBlur(e);

        /**
         * Limiting input validation on blur to:
         * A) when it's either touched for the time
         * B) when it's marked as dirty due to a value change
         */
        if (!touched[name] || isDirty(name)) {
          setValidityState({ [name]: getValidationResult(e) });
          setDirty(name, false);
        }
      },
      ...getIdProp('id', name, ownValue),
    };

    return inputProps;
  };

  const inputPropsCreators = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  // Form

  function submitForm(e) {
    e.preventDefault();
    formOptions.onSubmit();
  }

  function resetForm() {
    setState(null);
    setTouchedState(null);
    setValidityState(null);
    formOptions.onReset();
  }

  const formProps = {
    onSubmit: submitForm,
  };

  const form = {
    bind: formProps,
    reset: resetForm,
  };

  return [
    { values: state, validity, touched },
    {
      ...inputPropsCreators,
      [LABEL]: (name, ownValue) => getIdProp('htmlFor', name, ownValue),
      form,
    },
  ];
}
