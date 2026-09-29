import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { storage } from '@/lib/storage';

/**
 * `useState` backed by localStorage: initialized from the stored value (validated by `parse`)
 * and written back on every change. Only use in client-only trees to avoid hydration mismatches.
 */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  parse: (value: unknown) => T | null
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => storage.get(key, fallback, parse));

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
}
