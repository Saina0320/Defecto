import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { GlobalSearch } from '@/components/layout/header/GlobalSearch';
import { NotificationsMenu } from '@/components/layout/header/NotificationsMenu';
import { PersonaBadge } from '@/components/layout/header/PersonaBadge';
import { ThemeToggle } from '@/components/layout/header/ThemeToggle';
import { getHeaderTitle, ROUTES } from '@/constants/routes';
import { useTheme } from '@/providers/ThemeProvider';

export function AppHeader() {
  const { t } = useTheme();
  const pathname = usePathname();

  return (
    <header className={`h-16 ${t.headerBg} border-b px-6 flex items-center justify-between shadow-sm z-10 transition-colors duration-200`}>
      <div className="flex items-center gap-4">
        <h2 className={`text-lg font-bold ${t.headerText} tracking-tight capitalize`}>{getHeaderTitle(pathname)}</h2>
        <span className="text-neutral-300 dark:text-neutral-700">|</span>
        <span className={`text-xs ${t.mutedText} font-medium`}>
          CCID (16 Digits) & KYCID (with KYC- prefix) • Shared Global Persistence
        </span>
      </div>

      <div className="flex items-center gap-3">
        <GlobalSearch />

        <Link
          href={ROUTES.newDefect}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm transition cursor-pointer text-center"
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
