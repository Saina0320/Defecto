import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { DEMO_TEAM } from '@/data/demo-team';
import {
  addAnalystToRoster,
  deactivateAnalyst,
  reactivateAnalyst,
  type AddAnalystResult,
  type RosterActionResult,
} from '@/features/team/actions';
import { parseStoredTeam } from '@/features/team/lib/roster';
import { usePersistentState } from '@/hooks/usePersistentState';
import { useStreamedData } from '@/hooks/useStreamedData';
import type { TeamMember } from '@/types/team';

type TeamContextValue = {
  teamUsers: TeamMember[];
  /** The signed-in user. */
  currentUser: TeamMember;
  /** Creates a Profile row in PostgreSQL. Only reflected in teamUsers once the server confirms it. */
  addAnalyst: (fullName: string, soeId: string) => Promise<AddAnalystResult>;
  /** Re-enables a deactivated profile found by SOEID, instead of creating a duplicate. */
  reactivateAnalyst: (profileId: string) => Promise<RosterActionResult>;
  /** Sets Profile.active = false. The row and its historical defects/reads/audit log are kept. */
  decommissionAnalyst: (memberId: string) => Promise<RosterActionResult>;
};

const TeamContext = createContext<TeamContextValue | null>(null);

type TeamProviderProps = {
  /** Owner of the session, verified on the server by the dashboard layout. */
  authenticatedUser: TeamMember;
  /** Active profiles read started on the server by the dashboard layout. */
  teamPromise: Promise<TeamMember[]>;
  children: ReactNode;
};

export function TeamProvider({ authenticatedUser, teamPromise, children }: TeamProviderProps) {
  // The cached roster renders immediately; the database profiles replace it once loaded, and stay
  // authoritative after that — every mutation below only updates local state from what the
  // server actually persisted and returned, never optimistically.
  const [teamUsers, setTeamUsers] = usePersistentState(STORAGE_KEYS.USERS, DEMO_TEAM, parseStoredTeam);

  useStreamedData(teamPromise, setTeamUsers, 'Error loading profiles:');

  const addAnalyst = useCallback(async (fullName: string, soeId: string) => {
    const result = await addAnalystToRoster({ fullName, soeId });
    if (result.ok) {
      setTeamUsers((prev) => [...prev, result.member]);
    }
    return result;
  }, [setTeamUsers]);

  const reactivate = useCallback(async (profileId: string) => {
    const result = await reactivateAnalyst(profileId);
    if (result.ok) {
      setTeamUsers((prev) =>
        prev.some((member) => member.id === result.member.id)
          ? prev.map((member) => (member.id === result.member.id ? result.member : member))
          : [...prev, result.member]
      );
    }
    return result;
  }, [setTeamUsers]);

  const decommissionAnalyst = useCallback(async (memberId: string) => {
    const result = await deactivateAnalyst(memberId);
    if (result.ok) {
      // The active roster (getActiveProfiles) never includes inactive profiles, so a deactivated
      // member drops out of the list here too, matching what a refresh would show.
      setTeamUsers((prev) => prev.filter((member) => member.id !== memberId));
    }
    return result;
  }, [setTeamUsers]);

  const value = useMemo(
    () => ({ teamUsers, currentUser: authenticatedUser, addAnalyst, reactivateAnalyst: reactivate, decommissionAnalyst }),
    [teamUsers, authenticatedUser, addAnalyst, reactivate, decommissionAnalyst]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam must be used within TeamProvider');
  return context;
}
