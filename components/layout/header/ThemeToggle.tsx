import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();

  return (
    <button
      onClick={() => {
        toggleDarkMode();
        showToast(`Switched to ${darkMode ? 'Light' : 'Dark'} Mode`);
      }}
      className={`p-2 rounded-md border flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
        darkMode
          ? 'bg-[#1E2E4A] border-[#2A3F66] text-amber-300 hover:bg-[#253759]'
          : 'bg-white border-[#DEE2E6] text-neutral-700 hover:bg-neutral-100'
      }`}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {darkMode ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline text-slate-200">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-[#003EA4]" />
          <span className="hidden lg:inline text-neutral-700">Dark</span>
        </>
      )}
    </button>
  );
}
