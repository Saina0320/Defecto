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
      className={`p-2 rounded-[10px] border flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
        darkMode
          ? 'bg-[#122238] border-[#20344D] text-amber-300 hover:bg-[#17294a]'
          : 'bg-white border-[#D9E2EC] text-[#5B6B7A] hover:bg-[#F8FAFD]'
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
          <Moon className="w-4 h-4 text-[#0757C9]" />
          <span className="hidden lg:inline text-neutral-700">Dark</span>
        </>
      )}
    </button>
  );
}
