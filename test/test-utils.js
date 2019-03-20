import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { useFormState } from '../src';

export { renderHook } from 'react-hooks-testing-library';

export const InputTypes = {
  textLike: ['text', 'email', 'password', 'search', 'tel', 'url'],
  time: ['date', 'month', 'time', 'week'],
  numeric: ['number', 'range'],
};

export function renderWithHook(renderFn, ...hookArgs) {
  const formStateRef = { current: null };

  const Wrapper = ({ children }) => {
    const [state, inputs] = useFormState(...hookArgs);
    formStateRef.current = state;
    return children([state, inputs]);
  };

  const { container } = render(<Wrapper>{renderFn}</Wrapper>);

  const fire = (type, target, node = container.firstChild) => {
    fireEvent[type](node, { target });
  };

  return {
    root: container.firstChild,
    fire,
    formState: formStateRef,
    click: (...args) => fire('click', ...args),
    blur: (...args) => fire('blur', ...args),
    change: (...args) => fire('change', ...args),
  };
}
