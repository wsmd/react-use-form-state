import { useRef } from 'react';

export function useMap() {
  const map = useRef(new Map());
  return {
    set: (key, value) => map.current.set(key, value),
    has: key => map.current.has(key),
    get: key => map.current.get(key),
  };
}

export function useReferencedCallback() {
  const callbacks = useMap();
  return (key, current) => {
    if (!callbacks.has(key)) {
      const callback = (...args) => callback.current(...args);
      callbacks.set(key, callback);
    }
    callbacks.get(key).current = current;
    return callbacks.get(key);
  };
}
