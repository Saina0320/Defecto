import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getThemeClasses, type ThemeClasses } from '@/lib/theme';

type ThemeContextValue = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  /** Class tokens for the active theme. */
  t: ThemeClasses;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const parseDarkMode = (value: unknown) => (typeof value === 'boolean' ? value : null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = usePersistentState(STORAGE_KEYS.DARK_MODE, false, parseDarkMode);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), [setDarkMode]);

  const value = useMemo(
    () => ({ darkMode, toggleDarkMode, t: getThemeClasses(darkMode) }),
    [darkMode, toggleDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
