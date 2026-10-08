'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/layout/header/AppHeader';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { ToastBar } from '@/components/layout/ToastBar';
import { DefectDialogs } from '@/features/defects/components/DefectDialogs';
import { useTheme } from '@/providers/ThemeProvider';

/** Sidebar + header + scrollable page content, plus the globally rendered defect dialogs. */
export function DashboardFrame({ children }: { children: ReactNode }) {
  const { t } = useTheme();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Below lg, the sidebar is an overlay drawer — closing it on navigation keeps the next page
  // from opening underneath it. Adjusted during render (React's documented pattern for resetting
  // state on a prop change) rather than in an effect, which would cost an extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMobileNavOpen(false);
  }

  return (
    <div className={`flex h-screen ${t.appBg} font-sans overflow-hidden antialiased transition-colors duration-200`}>
      <Sidebar isMobileOpen={isMobileNavOpen} onCloseMobile={() => setIsMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <ToastBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">{children}</main>
      </div>

      <DefectDialogs />
    </div>
  );
}
