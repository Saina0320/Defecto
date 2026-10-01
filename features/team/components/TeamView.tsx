'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { AddAnalystModal } from '@/features/team/components/AddAnalystModal';
import { DeactivateAnalystDialog } from '@/features/team/components/DeactivateAnalystDialog';
import { TeamMemberCard } from '@/features/team/components/TeamMemberCard';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getActiveAnalysts } from '@/features/team/lib/roster';
import { isSupervisorRole } from '@/lib/permissions';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import type { TeamMember } from '@/types/team';

const DEACTIVATE_ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'Permission denied: only Managers and Admins can deactivate analysts.',
  self: 'You cannot deactivate your own profile.',
  'not-found': 'This profile no longer exists.',
  'not-an-analyst': 'Only Analyst team members can be deactivated from the roster.',
  'database-error': 'Could not deactivate the analyst. Try again.',
};

export function TeamView() {
  const { t } = useTheme();
  const { defects } = useDefects();
  const { teamUsers, currentUser, decommissionAnalyst } = useTeam();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deactivateCandidate, setDeactivateCandidate] = useState<TeamMember | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const canManageRoster = isSupervisorRole(currentUser.role);

  const closeDeactivateDialog = () => {
    if (isDeactivating) return;
    setDeactivateCandidate(null);
    setDeactivateError(null);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateCandidate || isDeactivating) return;

    setIsDeactivating(true);
    setDeactivateError(null);
    const result = await decommissionAnalyst(deactivateCandidate.id);
    setIsDeactivating(false);

    if (!result.ok) {
      // Deactivation failed: the dialog stays open, showing why, and the analyst stays active.
      setDeactivateError(DEACTIVATE_ERROR_MESSAGES[result.reason] ?? 'Could not deactivate the analyst. Try again.');
      return;
    }

    showToast(`${deactivateCandidate.name} deactivated. Historical records preserved.`);
    setDeactivateCandidate(null);
  };

  return (
    <div className="space-y-6">
      <div className={`${t.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded">KYC Operations Team</span>
            <span className={`text-xs ${t.mutedText}`}>1 QA Manager • {getActiveAnalysts(teamUsers).length} Active Analysts</span>
          </div>
          <h3 className={`text-base font-bold ${t.headingText}`}>Team Capacity & Analyst Management</h3>
          <p className={`text-xs ${t.mutedText} mt-0.5`}>
            View team roster and manage active members. Historical activity remains preserved when analysts are deactivated.
          </p>
        </div>

        {canManageRoster && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Analyst</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamUsers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            handledDefects={defects.filter((defect) => defect.analystName === member.name).length}
            onDecommission={
              canManageRoster && member.role === 'Analyst' && member.status === 'Active' && member.id !== currentUser.id
                ? () => setDeactivateCandidate(member)
                : undefined
            }
          />
        ))}
      </div>

      {isAddModalOpen && <AddAnalystModal onClose={() => setIsAddModalOpen(false)} />}
      {deactivateCandidate && (
        <DeactivateAnalystDialog
          member={deactivateCandidate}
          isDeactivating={isDeactivating}
          error={deactivateError}
          onCancel={closeDeactivateDialog}
          onConfirm={handleConfirmDeactivate}
        />
      )}
    </div>
  );
}
