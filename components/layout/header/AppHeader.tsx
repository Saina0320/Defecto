import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import { GlobalSearch } from '@/components/layout/header/GlobalSearch';
import { NotificationsMenu } from '@/components/layout/header/NotificationsMenu';
import { PersonaBadge } from '@/components/layout/header/PersonaBadge';
import { ThemeToggle } from '@/components/layout/header/ThemeToggle';
import { getHeaderTitle, ROUTES } from '@/constants/routes';
import { useTheme } from '@/providers/ThemeProvider';

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { t } = useTheme();
  const pathname = usePathname();

  return (
    <header className={`h-14 ${t.headerBg} border-b px-4 sm:px-6 flex items-center justify-between z-10 transition-colors duration-200`}>
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenMobileNav} className={`p-1.5 -ml-1 rounded-[10px] ${t.mutedText} hover:bg-[#F8FAFD] dark:hover:bg-white/5 lg:hidden flex-shrink-0`} aria-label="Open navigation">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className={`text-base font-bold ${t.headerText} tracking-tight capitalize truncate`}>{getHeaderTitle(pathname)}</h2>
        <span className="text-[#D9E2EC] dark:text-[#20344D] flex-shrink-0">|</span>
        <span className={`text-xs ${t.mutedText} font-medium hidden lg:inline truncate`}>
          CCID (16 Digits) & KYCID (with KYC- prefix) • Shared Global Persistence
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <GlobalSearch />

        <Link
          href={ROUTES.newDefect}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0757C9] hover:bg-[#063B82] text-white text-xs font-semibold rounded-[10px] shadow-sm transition cursor-pointer text-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Defect</span>
        </Link>

        <ThemeToggle />
        <NotificationsMenu />
        <PersonaBadge />
      </div>
    </header>
  );
}
