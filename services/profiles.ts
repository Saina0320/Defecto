import 'server-only';
import type { Prisma } from '@/generated/prisma/client';
import { getPrisma } from '@/lib/prisma';
import type { TeamMember, UserRole } from '@/types/team';

export const teamMemberSelect = {
  id: true,
  soeId: true,
  firstName: true,
  lastName: true,
  role: true,
  active: true,
} satisfies Prisma.ProfileSelect;

type TeamMemberRecord = Prisma.ProfileGetPayload<{ select: typeof teamMemberSelect }>;

function toUserRole(role: string): UserRole {
  if (role === 'admin') return 'Admin';
  if (role === 'manager') return 'Manager';
  return 'Analyst';
}

export function toTeamMember(profile: TeamMemberRecord): TeamMember {
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    soeId: profile.soeId,
    role: toUserRole(profile.role),
    email: profile.soeId,
    status: profile.active ? 'Active' : 'Inactive',
    initials: `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase(),
  };
}

export async function getActiveProfiles(): Promise<TeamMember[]> {
  const profiles = await getPrisma().profile.findMany({
    where: { active: true },
    orderBy: { firstName: 'asc' },
    select: teamMemberSelect,
  });

  return profiles.map(toTeamMember);
}

/**
 * The active profile that owns the SOE ID, or null. Expects the SOE ID as profiles store it
 * (see features/auth/lib/soeId.ts); profiles_soe_id_key guarantees at most one match.
 */
export async function findActiveProfileBySoeId(soeId: string): Promise<TeamMember | null> {
  const profile = await getPrisma().profile.findUnique({
    where: { soeId },
    select: teamMemberSelect,
  });

  return profile?.active ? toTeamMember(profile) : null;
}

/** Looks up a profile by "First Last" name. Returns null (and logs) unless exactly one matches. */
export async function findProfileIdByFullName(fullName: string): Promise<string | null> {
  const [firstName, ...lastNameParts] = fullName.split(' ');

  const matches = await getPrisma().profile.findMany({
    where: { firstName, lastName: lastNameParts.join(' ') },
    select: { id: true },
    take: 2,
  });

  if (matches.length !== 1) {
    console.error(`Error finding analyst: ${matches.length === 0 ? 'no profile' : 'more than one profile'} named "${fullName}".`);
    return null;
  }

  return matches[0].id;
}
