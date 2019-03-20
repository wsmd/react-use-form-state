import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { useFormState } from '../src';

export { renderHook } from 'react-hooks-testing-library';

export const InputTypes = {
  textLike: ['text', 'email', 'password', 'search', 'tel', 'url'],
  time: ['date', 'month', 'time', 'week'],
  numeric: ['number', 'range'],
};

export function renderWithFormState(renderFn, ...useFormStateArgs) {
  const formStateRef = { current: null };

  const Wrapper = ({ children }) => {
    const [state, inputs] = useFormState(...useFormStateArgs);
    formStateRef.current = state;
    return children([state, inputs]);
  };

  const { container } = render(<Wrapper>{renderFn}</Wrapper>);

  const fire = (type, target, node = container.firstChild) => {
    fireEvent[type](node, { target });
  };

  return {
    blur: (...args) => fire('blur', ...args),
    change: (...args) => fire('change', ...args),
    click: (...args) => fire('click', ...args),
    formState: formStateRef,
    root: container.firstChild,
  };
}
