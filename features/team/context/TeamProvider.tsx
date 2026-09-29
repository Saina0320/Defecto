import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { DEMO_TEAM } from '@/data/demo-team';
import { createAnalystMember, parseStoredTeam } from '@/features/team/lib/roster';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getActiveProfiles } from '@/services/profiles';
import type { TeamMember } from '@/types/team';

// Shown only while the roster is empty.
const PLACEHOLDER_USER: TeamMember = {
  id: '',
  name: 'Loading...',
  role: 'Analyst',
  email: '',
  initials: 'LO',
  status: 'Active',
};

type TeamContextValue = {
  teamUsers: TeamMember[];
  /** The simulated persona: the explicitly selected member, or the first one in the roster. */
  currentUser: TeamMember;
  selectedUserId: string | null;
  selectUser: (userId: string) => TeamMember | undefined;
  addAnalyst: (name: string, email: string) => TeamMember;
  decommissionAnalyst: (memberId: string) => void;
  resetTeam: () => void;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  // The cached roster renders immediately; Supabase profiles replace it once loaded.
  const [teamUsers, setTeamUsers] = usePersistentState(STORAGE_KEYS.USERS, DEMO_TEAM, parseStoredTeam);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getActiveProfiles()
      .then((members) => {
        if (!cancelled) setTeamUsers(members);
      })
      .catch((error: unknown) => {
        console.error('Error loading profiles:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [setTeamUsers]);

  const currentUser = useMemo(
    () => teamUsers.find((member) => member.id === selectedUserId) ?? teamUsers[0] ?? PLACEHOLDER_USER,
    [selectedUserId, teamUsers]
  );

  const selectUser = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);
      return teamUsers.find((member) => member.id === userId);
    },
    [teamUsers]
  );

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

  const resetTeam = useCallback(() => setTeamUsers(DEMO_TEAM), [setTeamUsers]);

  const value = useMemo(
    () => ({ teamUsers, currentUser, selectedUserId, selectUser, addAnalyst, decommissionAnalyst, resetTeam }),
    [teamUsers, currentUser, selectedUserId, selectUser, addAnalyst, decommissionAnalyst, resetTeam]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext);
  if (!context) throw new Error('useTeam must be used within TeamProvider');
  return context;
}
