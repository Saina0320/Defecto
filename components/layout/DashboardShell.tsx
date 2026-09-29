'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// Client-only boundary (same approach as the original app): the dashboard state starts from
// localStorage (theme, cached roster) and loads data with the browser Supabase client, so
// server-rendering it would produce hydration mismatches.
const DashboardApp = dynamic(() => import('@/components/layout/DashboardApp').then((mod) => mod.DashboardApp), {
  ssr: false,
});

export function DashboardShell({ children }: { children: ReactNode }) {
  return <DashboardApp>{children}</DashboardApp>;
}
