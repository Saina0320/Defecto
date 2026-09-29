import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/header/AppHeader';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { ToastBar } from '@/components/layout/ToastBar';
import { DefectDialogs } from '@/features/defects/components/DefectDialogs';
import { useTheme } from '@/providers/ThemeProvider';

/** Sidebar + header + scrollable page content, plus the globally rendered defect dialogs. */
export function DashboardFrame({ children }: { children: ReactNode }) {
  const { t } = useTheme();

  return (
    <div className={`flex h-screen ${t.appBg} font-sans overflow-hidden antialiased transition-colors duration-200`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader />
        <ToastBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">{children}</main>
      </div>

      <DefectDialogs />
    </div>
  );
}
