import { useRef, useCallback } from 'react';

export function useMarkAsDirty() {
  const dirty = useRef({});
  const isDirty = useCallback(name => dirty.current[name], []);
  const setDirty = useCallback((name, value) => {
    dirty.current[name] = value;
  }, []);
  return { setDirty, isDirty };
}
