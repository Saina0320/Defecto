import { connection } from 'next/server';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getDefects } from '@/services/defects';
import { getActiveProfiles } from '@/services/profiles';

export default async function DashboardLayout({ children }: LayoutProps<'/'>) {
  // The registry is read on every request, never while building.
  await connection();

  // Not awaited: the queries start here and their results stream to the client providers,
  // so the dashboard renders without waiting for the database.
  const data = { team: getActiveProfiles(), defects: getDefects() };

  return <DashboardShell data={data}>{children}</DashboardShell>;
}
