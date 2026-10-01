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

export function toUserRole(role: string): UserRole {
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

/** Splits "First Middle Last" the way profiles.firstName/lastName store a name: first word, then the rest. */
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
  return { firstName, lastName: lastNameParts.join(' ') };
}

/** Looks up a profile by "First Last" name. Returns null (and logs) unless exactly one matches. */
export async function findProfileIdByFullName(fullName: string): Promise<string | null> {
  const { firstName, lastName } = splitFullName(fullName);

  const matches = await getPrisma().profile.findMany({
    where: { firstName, lastName },
    select: { id: true },
    take: 2,
  });

  if (matches.length !== 1) {
    console.error(`Error finding analyst: ${matches.length === 0 ? 'no profile' : 'more than one profile'} named "${fullName}".`);
    return null;
  }

  return matches[0].id;
}

/** Any profile with this SOEID, active or not — used to offer reactivation instead of a duplicate. */
export async function findProfileBySoeIdIncludingInactive(soeId: string): Promise<TeamMember | null> {
  const profile = await getPrisma().profile.findUnique({ where: { soeId }, select: teamMemberSelect });
  return profile ? toTeamMember(profile) : null;
}

/** A profile by its database id, active or not. */
export async function findProfileById(profileId: string): Promise<TeamMember | null> {
  const profile = await getPrisma().profile.findUnique({ where: { id: profileId }, select: teamMemberSelect });
  return profile ? toTeamMember(profile) : null;
}

export type NewAnalystValues = { fullName: string; soeId: string };

/** Creates a new active Analyst profile. The caller must have already checked the SOEID is free. */
export async function createAnalystProfile(values: NewAnalystValues): Promise<TeamMember> {
  const { firstName, lastName } = splitFullName(values.fullName);

  const profile = await getPrisma().profile.create({
    data: { soeId: values.soeId, firstName, lastName, role: 'analyst', active: true },
    select: teamMemberSelect,
  });

  return toTeamMember(profile);
}

/** Flips a profile's active flag: used both to remove an analyst from the active roster and to reactivate one. */
export async function setProfileActive(profileId: string, active: boolean): Promise<TeamMember> {
  const profile = await getPrisma().profile.update({
    where: { id: profileId },
    data: { active },
    select: teamMemberSelect,
  });

  return toTeamMember(profile);
}
