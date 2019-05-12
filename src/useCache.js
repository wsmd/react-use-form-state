import { useRef } from 'react';

export function useCache() {
  const cache = useRef(new Map());
  const has = key => cache.current.has(key);
  const get = key => cache.current.get(key);
  const set = (key, value) => cache.current.set(key, value);

  return { set, has, get };
}
