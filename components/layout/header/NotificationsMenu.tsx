import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const NOTICES = [
  {
    title: 'Shared Unified Persistence',
    body: 'CRUD operations made under any role are preserved and shared synchronously across Analyst, Manager, and Admin.',
    accentClass: 'border-[#003EA4]',
    lightBgClass: 'bg-[#F0F7FF]',
    titleClass: { dark: 'text-blue-200', light: 'text-[#002D72]' },
  },
  {
    title: 'Zero Defect Resilience',
    body: 'An empty registry list is safely preserved across browser reloads without causing navigation faults.',
    accentClass: 'border-amber-500',
    lightBgClass: 'bg-[#FFFBEB]',
    titleClass: { dark: 'text-amber-300', light: 'text-[#92400E]' },
  },
] as const;

export function NotificationsMenu() {
  const { darkMode, t } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${t.mutedText} hover:text-neutral-800 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-white/5 relative cursor-pointer`}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-[#111E38] border-[#1E2E4A] text-white' : 'bg-white border-neutral-200 text-[#1E293B] shadow-2xl'} rounded-lg p-3 z-50 text-xs border`}
        >
          <div className={`flex justify-between items-center pb-2 border-b ${t.dividerNeutral} font-bold`}>
            <span className={darkMode ? 'text-white' : 'text-[#002D72]'}>Defect Workflow Notifications</span>
            <span
              className={`text-[10px] ${darkMode ? 'text-blue-300 bg-blue-900/50' : 'text-[#003EA4] bg-blue-100'} px-1.5 py-0.5 rounded font-mono font-bold`}
            >
              Shared State
            </span>
          </div>

          <div className="space-y-2 py-2">
            {NOTICES.map((notice) => (
              <div key={notice.title} className={`p-2.5 rounded border-l-4 ${notice.accentClass} ${darkMode ? 'bg-[#0B1426]' : notice.lightBgClass}`}>
                <p className={`font-bold text-[11px] ${darkMode ? notice.titleClass.dark : notice.titleClass.light}`}>{notice.title}</p>
                <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-300' : 'text-[#334155]'}`}>{notice.body}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className={`w-full text-center text-[10px] font-semibold pt-1 border-t cursor-pointer ${darkMode ? 'border-neutral-700 text-neutral-400 hover:text-white' : 'border-neutral-200 text-neutral-600 hover:text-neutral-900'}`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
