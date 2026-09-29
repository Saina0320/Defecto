/**
 * Safe localStorage access. Strictly preserves empty collections ([]) and falls back
 * gracefully in sandboxed environments where storage is unavailable.
 */
export const storage = {
  /**
   * Returns the stored value when the key has been initialized and `parse` accepts it;
   * otherwise returns `fallback`.
   */
  get<T>(key: string, fallback: T, parse: (value: unknown) => T | null): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null && item !== '') {
          return parse(JSON.parse(item)) ?? fallback;
        }
      }
    } catch {
      // Storage unavailable or corrupted value: use the fallback.
    }
    return fallback;
  },

  set(key: string, value: unknown): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage unavailable: keep working in memory.
    }
  },
};
