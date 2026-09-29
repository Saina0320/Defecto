import { useEffect } from 'react';

/**
 * Hands the value of a promise created in a Server Component to `onData` once it arrives, and
 * logs the error if it fails. Rendering does not wait for it. `onData` must be a stable function.
 */
export function useStreamedData<T>(promise: Promise<T>, onData: (data: T) => void, errorLabel: string): void {
  useEffect(() => {
    let cancelled = false;

    // React delivers these promises as thenables whose `then` returns nothing, so they
    // cannot be chained directly.
    Promise.resolve(promise)
      .then((data) => {
        if (!cancelled) onData(data);
      })
      .catch((error: unknown) => {
        console.error(errorLabel, error);
      });

    return () => {
      cancelled = true;
    };
  }, [promise, onData, errorLabel]);
}
