import { useCache } from './useCache';

export function useMarkAsDirty() {
  const dirty = useCache();
  return {
    setDirty: dirty.set,
    isDirty: dirty.has,
  };
}
