'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { DashboardData } from '@/providers/AppProviders';

// Client-only boundary (same approach as the original app): the dashboard state starts from
// localStorage (theme, cached roster), so server-rendering it would produce hydration mismatches.
const DashboardApp = dynamic(() => import('@/components/layout/DashboardApp').then((mod) => mod.DashboardApp), {
  ssr: false,
});

export function DashboardShell({ data, children }: { data: DashboardData; children: ReactNode }) {
  return <DashboardApp data={data}>{children}</DashboardApp>;
}
