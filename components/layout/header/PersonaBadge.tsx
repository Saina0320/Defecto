'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { logout } from '@/features/auth/actions';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getRoleBadgeClass } from '@/lib/theme';
import { useTheme } from '@/providers/ThemeProvider';

/**
 * Topbar user menu. Only two real actions exist today — view the signed-in identity, and sign
 * out — so that is all this shows; no placeholder "Profile"/"Appearance" links to pages that
 * don't exist. Sign out reuses the exact same Server Function as the sidebar's LogoutButton.
 */
export function PersonaBadge() {
  const { darkMode, t } = useTheme();
  const { currentUser } = useTeam();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative pl-2.5 border-l border-[#D9E2EC] dark:border-[#20344D]" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 cursor-pointer rounded-[10px] px-1 py-0.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
      >
        <div className="w-6 h-6 rounded-full bg-[#0757C9] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {currentUser.initials}
        </div>
        <span className={`hidden md:inline text-xs font-semibold ${t.headerText} max-w-[120px] truncate`}>{currentUser.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 ${t.mutedText} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 ${darkMode ? 'bg-[#0E1A2B] border-[#20344D]' : 'bg-white border-[#D9E2EC] shadow-2xl'} rounded-[14px] p-2 z-50 border`}
        >
          <div className={`px-2 py-2 border-b ${t.dividerNeutral} mb-1.5`}>
            <p className={`text-xs font-bold ${t.headingText} truncate`}>{currentUser.name}</p>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getRoleBadgeClass(currentUser.role, darkMode)}`}>
              {currentUser.role}
            </span>
          </div>

          <button
            type="button"
            onClick={() => startTransition(logout)}
            disabled={isPending}
            className={`w-full text-left px-2 py-1.5 rounded-[10px] text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${darkMode ? 'text-red-300 hover:bg-red-950/30' : 'text-red-600 hover:bg-red-50'} disabled:cursor-wait disabled:opacity-70`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {isPending ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
