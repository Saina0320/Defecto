import type { ReactNode } from 'react';
import { DashboardFrame } from '@/components/layout/DashboardFrame';
import { AppProviders, type DashboardData } from '@/providers/AppProviders';

export function DashboardApp({ data, children }: { data: DashboardData; children: ReactNode }) {
  return (
    <AppProviders data={data}>
      <DashboardFrame>{children}</DashboardFrame>
    </AppProviders>
  );
}
