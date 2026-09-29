import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { DEMO_TEAM } from '@/data/demo-team';
import { createAnalystMember, parseStoredTeam } from '@/features/team/lib/roster';
import { usePersistentState } from '@/hooks/usePersistentState';
import { useStreamedData } from '@/hooks/useStreamedData';
import type { TeamMember } from '@/types/team';

type TeamContextValue = {
  teamUsers: TeamMember[];
  /** The signed-in user. */
  currentUser: TeamMember;
  addAnalyst: (name: string, email: string) => TeamMember;
  decommissionAnalyst: (memberId: string) => void;
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
  // The cached roster renders immediately; the database profiles replace it once loaded.
  const [teamUsers, setTeamUsers] = usePersistentState(STORAGE_KEYS.USERS, DEMO_TEAM, parseStoredTeam);

  useStreamedData(teamPromise, setTeamUsers, 'Error loading profiles:');

  const addAnalyst = useCallback(
    (name: string, email: string) => {
      const member = createAnalystMember(teamUsers, name, email);
      setTeamUsers((prev) => [...prev, member]);
      return member;
    },
    [teamUsers, setTeamUsers]
  );

  const decommissionAnalyst = useCallback(
    (memberId: string) => {
      setTeamUsers((prev) =>
        prev.map((member) => (member.id === memberId ? { ...member, status: 'Decommissioned' } : member))
      );
    },
    [setTeamUsers]
  );

  const value = useMemo(
    () => ({ teamUsers, currentUser: authenticatedUser, addAnalyst, decommissionAnalyst }),
    [teamUsers, authenticatedUser, addAnalyst, decommissionAnalyst]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam must be used within TeamProvider');
  return context;
}
