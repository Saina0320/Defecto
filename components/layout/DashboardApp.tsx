import type { ReactNode } from 'react';
import { DashboardFrame } from '@/components/layout/DashboardFrame';
import { AppProviders } from '@/providers/AppProviders';

export function DashboardApp({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <DashboardFrame>{children}</DashboardFrame>
    </AppProviders>
  );
}
