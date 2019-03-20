import { useReducer, useRef } from 'react';
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
  withIds: false,
};

function useCache() {
  const cacheRef = useRef(new Map());
  return (key, value, cache = cacheRef.current) =>
    cache.get(key) || cache.set(key, value).get(key);
}

const ON_CHANGE_HANDLER = 0;
const ON_BLUR_HANDLER = 1;

export default function useFormState(initialState, options) {
  const formOptions = { ...defaultFromOptions, ...options };

  const [__VALUES__, setValues] = useReducer(stateReducer, initialState || {});
  const [__TOUCHED__, setTouched] = useReducer(stateReducer, {});
  const [__VALIDITY__, setValidity] = useReducer(stateReducer, {});

  const { getIdProp } = useInputId(formOptions.withIds);
  const { setDirty, isDirty } = useMarkAsDirty();

  const state = useRef();
  state.current = {
    values: __VALUES__,
    touched: __TOUCHED__,
    validity: __VALIDITY__,
  };

  const resolveCached = useCache();

  const createPropsGetter = type => (...args) => {
    const { name, ownValue, ...inputOptions } = parseInputArgs(args);

    const hasOwnValue = !!toString(ownValue);
    const hasValueInState = state.current.values[name] !== undefined;
    const isCheckbox = type === CHECKBOX;
    const isRadio = type === RADIO;
    const isSelectMultiple = type === SELECT_MULTIPLE;

    const key = `${type}.${name}.${toString(ownValue)}`;

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
      setValues({ [name]: value });
    }

    function getNextCheckboxValue(e) {
      const { value, checked } = e.target;
      if (!hasOwnValue) {
        return checked;
      }
      const checkedValues = new Set(state.current.values[name]);
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

    function getValidationResult(e, values) {
      if (typeof inputOptions.validate === 'function') {
        return !!inputOptions.validate(e.target.value, values, e);
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
        const { values } = state.current;
        if (isRadio) {
          return values[name] === toString(ownValue);
        }
        if (isCheckbox) {
          if (!hasOwnValue) {
            return values[name] || false;
          }
          /**
           * @todo Handle the case where two checkbox inputs share the same
           * name, but one has a value, the other doesn't (throws currently).
           * <input {...input.checkbox('option1')} />
           * <input {...input.checkbox('option1', 'value_of_option1')} />
           */
          return hasValueInState
            ? values[name].includes(toString(ownValue))
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
        return hasValueInState ? state.current.values[name] : '';
      },
      onChange: resolveCached(ON_BLUR_HANDLER + key, e => {
        setDirty(name, true);
        let { value } = e.target;
        if (isCheckbox) {
          value = getNextCheckboxValue(e);
        }
        if (isSelectMultiple) {
          value = getNextSelectMultipleValue(e);
        }

        const partialNewState = { [name]: value };
        const newValues = { ...state, ...partialNewState };

        formOptions.onChange(e, state.current.values, newValues);
        inputOptions.onChange(e);

        if (!inputOptions.validateOnBlur) {
          setValidity({ [name]: getValidationResult(e, newValues) });
        }

        setValues(partialNewState);
      }),
      onBlur: resolveCached(ON_CHANGE_HANDLER + key, e => {
        if (!state.current.touched[name]) {
          setTouched({ [name]: true });
          formOptions.onTouched(e);
        }

        inputOptions.onBlur(e);
        formOptions.onBlur(e);

        /**
         * Limiting input validation on blur to:
         * A) when it's either touched for the time
         * B) when it's marked as dirty due to a value change
         */
        if (!state.current.touched[name] || isDirty(name)) {
          setValidity({ [name]: getValidationResult(e, state.current.values) });
          setDirty(name, false);
        }
      }),
      ...getIdProp('id', name, ownValue),
    };

    return inputProps;
  };

  const inputPropsCreators = TYPES.reduce(
    (methods, type) => ({ ...methods, [type]: createPropsGetter(type) }),
    {},
  );

  return [
    state.current,
    {
      ...inputPropsCreators,
      [LABEL]: (name, ownValue) => getIdProp('htmlFor', name, ownValue),
    },
  ];
}
