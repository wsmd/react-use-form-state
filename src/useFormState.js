import { useRef } from 'react';
import {
  toString,
  noop,
  omit,
  isFunction,
  isEmpty,
  isEqualByValue,
} from './utils';
import { parseInputArgs } from './parseInputArgs';
import { useInputId } from './useInputId';
import { useCache } from './useCache';
import { useState } from './useState';
import {
  INPUT_TYPES,
  SELECT,
  CHECKBOX,
  RADIO,
  RAW,
  TEXTAREA,
  SELECT_MULTIPLE,
  LABEL,
  ON_CHANGE_HANDLER,
  ON_BLUR_HANDLER,
  CONSOLE_TAG,
} from './constants';

const defaultFormOptions = {
  onBlur: noop,
  onChange: noop,
  onClear: noop,
  onReset: noop,
  onTouched: noop,
  withIds: false,
};

export default function useFormState(initialState, options) {
  const formOptions = { ...defaultFormOptions, ...options };

  const formState = useState({ initialState });
  const { getIdProp } = useInputId(formOptions.withIds);
  const { set: setDirty, has: isDirty } = useCache();
  const callbacks = useCache();
  const devWarnings = useCache();

  function warn(key, type, message) {
    if (!devWarnings.has(`${type}:${key}`)) {
      devWarnings.set(`${type}:${key}`, true);
      // eslint-disable-next-line no-console
      console.warn(CONSOLE_TAG, message);
    }
  }

  const createPropsGetter = type => (...args) => {
    const { name, ownValue, ...inputOptions } = parseInputArgs(args);

    const hasOwnValue = !!toString(ownValue);
    const isCheckbox = type === CHECKBOX;
    const isRadio = type === RADIO;
    const isSelectMultiple = type === SELECT_MULTIPLE;
    const isRaw = type === RAW;
    const hasValueInState = formState.current.values[name] !== undefined;

    // This is used to cache input props that shouldn't change across
    // re-renders.  Note that for `raw` values, `toString(ownValue)`
    // will return '[object Object]'.  This means we can't have multiple
    // raw inputs with the same name and different values, but this is
    // probably fine.
    const key = `${type}.${name}.${toString(ownValue)}`;

    function setDefaultValue() {
      /* istanbul ignore else */
      if (process.env.NODE_ENV === 'development') {
        if (isRaw && formState.current.values[name] === undefined) {
          warn(
            key,
            'missingInitialValue',
            `The initial value for input "${name}" is missing. Custom inputs ` +
              'controlled with raw() are expected to have an initial value ' +
              'provided to useFormState(). To prevent React from treating ' +
              'this input as uncontrolled, an empty string will be used instead.',
          );
        }
      }

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
      formState.setValues({ [name]: value });
    }

    function getNextCheckboxValue(e) {
      const { value, checked } = e.target;
      if (!hasOwnValue) {
        return checked;
      }
      const checkedValues = new Set(formState.current.values[name]);
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

    function validate(
      e,
      value = isRaw ? formState.current.values[name] : e.target.value,
      values = formState.current.values,
    ) {
      let error;
      let isValid = true;
      /* istanbul ignore else */
      if (isFunction(inputOptions.validate)) {
        const result = inputOptions.validate(value, values, e);
        if (result !== true && result != null) {
          isValid = false;
          error = result !== false ? result : '';
        }
      } else if (!isRaw) {
        isValid = e.target.validity.valid;
        error = e.target.validationMessage;
      } else if (process.env.NODE_ENV === 'development') {
        warn(
          key,
          'missingValidate',
          `You used a raw input type for "${name}" without providing a ` +
            'custom validate method. As a result, validation of this input ' +
            'will be set to "true" automatically. If you need to validate ' +
            'this input, provide a custom validation option.',
        );
      }
      formState.setValidity({ [name]: isValid });
      formState.setError(isEmpty(error) ? omit(name) : { [name]: error });
    }

    function touch(e) {
      if (!formState.current.touched[name]) {
        formState.setTouched({ [name]: true });
        formOptions.onTouched(e);
      }
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
        const { values } = formState.current;
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
        if (!hasValueInState) {
          // auto populating default values if an initial value is not provided
          setDefaultValue();
        } else if (!formState.initialValues.has(name)) {
          // keep track of user-provided initial values on first render
          formState.initialValues.set(name, formState.current.values[name]);
        }

        // auto populating default values of touched
        if (formState.current.touched[name] == null) {
          formState.setTouched({ [name]: false });
        }

        /**
         * Since checkbox and radio inputs have their own user-defined values,
         * and since checkbox inputs can be either an array or a boolean,
         * returning the value of input from the current form state is illogical
         */
        if (isCheckbox || isRadio) {
          return toString(ownValue);
        }

        return hasValueInState ? formState.current.values[name] : '';
      },
      onChange: callbacks.getOrSet(ON_BLUR_HANDLER + key, e => {
        setDirty(name, true);
        let value;
        if (isRaw) {
          value = inputOptions.onChange(e);
          if (value === undefined) {
            // setting value to its current state if onChange does not return
            // value to prevent React from complaining about the input switching
            // from controlled to uncontrolled
            value = formState.current.values[name];
            /* istanbul ignore else */
            if (process.env.NODE_ENV === 'development') {
              warn(
                key,
                'onChangeUndefined',
                `You used a raw input type for "${name}" with an onChange() ` +
                  'option without returning a value. The onChange callback ' +
                  'of raw inputs, when provided, is used to determine the ' +
                  'custom value that will be stored in the form state. ' +
                  'Therefore, a value must be returned from the onChange callback.',
              );
            }
          }
        } else {
          if (isCheckbox) {
            value = getNextCheckboxValue(e);
          } else if (isSelectMultiple) {
            value = getNextSelectMultipleValue(e);
          } else {
            ({ value } = e.target);
          }
          inputOptions.onChange(e);
        }

        // Mark raw fields as touched on change, since we might not get an
        // `onBlur` event from them.
        if (inputOptions.touchOnChange) {
          touch(e);
        }

        const isPristine = inputOptions.compare(
          formState.initialValues.get(name),
          value,
        );

        formState.setPristine(isPristine ? omit(name) : { [name]: false });

        const partialNewState = { [name]: value };
        const newValues = { ...formState.current.values, ...partialNewState };

        formOptions.onChange(e, formState.current.values, newValues);

        const validateOnBlur = formOptions.validateOnBlur
          ? inputOptions.validateOnBlur !== false
          : inputOptions.validateOnBlur;

        if (!validateOnBlur) {
          validate(e, value, newValues);
        }

        formState.setValues(partialNewState);
      }),
      onBlur: callbacks.getOrSet(ON_CHANGE_HANDLER + key, e => {
        touch(e);

        inputOptions.onBlur(e);
        formOptions.onBlur(e);

        /**
         * Limiting input validation on blur to:
         * A) when it's either touched for the first time
         * B) when it's marked as dirty due to a value change
         */
        /* istanbul ignore else */
        if (!formState.current.touched[name] || isDirty(name)) {
          validate(e);
          setDirty(name, false);
        }
      }),
      ...getIdProp('id', name, ownValue),
    };

    return isRaw
      ? {
          onChange: inputProps.onChange,
          onBlur: inputProps.onBlur,
          value: inputProps.value,
        }
      : inputProps;
  };

  const formStateAPI = useRef({
    clearField: formState.clearField,
    resetField: formState.resetField,
    setField(name, value) {
      formState.setField(name, value, true, true);
    },
    setFieldError(name, error) {
      formState.setValidity({ [name]: false });
      formState.setError({ [name]: error });
    },
    clear() {
      formState.forEach(formState.clearField);
      formOptions.onClear();
    },
    reset() {
      formState.forEach(formState.resetField);
      formOptions.onReset();
    },
  });

  // exposing current form state (e.g. values, touched, validity, etc)
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in formState.current) {
    formStateAPI.current[key] = formState.current[key];
  }

  const inputPropsCreators = {
    [LABEL]: (name, ownValue) => getIdProp('htmlFor', name, ownValue),
  };

  INPUT_TYPES.forEach(type => {
    inputPropsCreators[type] = createPropsGetter(type);
  });

  return [formStateAPI.current, inputPropsCreators];
}
