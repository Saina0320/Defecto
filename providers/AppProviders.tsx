import type { ReactNode } from 'react';
import { DefectDialogsProvider } from '@/features/defects/context/DefectDialogsProvider';
import { DefectFiltersProvider } from '@/features/defects/context/DefectFiltersProvider';
import { DefectsProvider } from '@/features/defects/context/DefectsProvider';
import { NewDefectDraftProvider } from '@/features/new-defect/context/NewDefectDraftProvider';
import { TeamProvider } from '@/features/team/context/TeamProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import type { Defect } from '@/types/defect';
import type { TeamMember } from '@/types/team';

/** Database reads started by the (dashboard) layout on the server; they resolve on the client. */
export type DashboardData = {
  team: Promise<TeamMember[]>;
  defects: Promise<Defect[]>;
};

/**
 * Dashboard-wide state. Mounted in the (dashboard) layout, which persists across route changes,
 * so data, filters and the new-defect draft survive navigation. Order matters: inner providers
 * depend on the outer ones.
 */
export function AppProviders({ data, children }: { data: DashboardData; children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TeamProvider teamPromise={data.team}>
          <DefectsProvider defectsPromise={data.defects}>
            <DefectFiltersProvider>
              <NewDefectDraftProvider>
                <DefectDialogsProvider>{children}</DefectDialogsProvider>
              </NewDefectDraftProvider>
            </DefectFiltersProvider>
          </DefectsProvider>
        </TeamProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
