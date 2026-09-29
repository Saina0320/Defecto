import { DashboardShell } from '@/components/layout/DashboardShell';
import { requireUser } from '@/lib/auth/session';
import { getDefects } from '@/services/defects';
import { getActiveProfiles } from '@/services/profiles';

export default async function DashboardLayout({ children }: LayoutProps<'/'>) {
  // Every screen of the app is under this layout and none of them reads data on its own:
  // it all comes from the queries below, which only start for a signed-in user.
  // Reading the session also makes this run on every request, never while building.
  const user = await requireUser();

  // Not awaited: the queries start here and their results stream to the client providers,
  // so the dashboard renders without waiting for the database.
  const data = { user, team: getActiveProfiles(), defects: getDefects() };

  return <DashboardShell data={data}>{children}</DashboardShell>;
}
