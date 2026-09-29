import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const TOAST_DURATION_MS = 3500;

type ToastActions = {
  showToast: (message: string) => void;
  dismissToast: () => void;
};

// Actions and message live in separate contexts so components that only trigger
// toasts don't re-render every time a toast appears or disappears.
const ToastActionsContext = createContext<ToastActions | null>(null);
const ToastMessageContext = createContext<string | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const showToast = useCallback(
    (nextMessage: string) => {
      clearTimer();
      setMessage(nextMessage);
      timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
    },
    [clearTimer]
  );

  const dismissToast = useCallback(() => {
    clearTimer();
    setMessage(null);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const actions = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastActionsContext.Provider value={actions}>
      <ToastMessageContext.Provider value={message}>{children}</ToastMessageContext.Provider>
    </ToastActionsContext.Provider>
  );
}

export function useToast(): ToastActions {
  const context = useContext(ToastActionsContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function useToastMessage(): string | null {
  return useContext(ToastMessageContext);
}
