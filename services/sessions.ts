import 'server-only';
import { getPrisma } from '@/lib/prisma';
import { teamMemberSelect, toTeamMember } from '@/services/profiles';
import type { TeamMember } from '@/types/team';

export type NewSessionValues = {
  tokenHash: string;
  profileId: string;
  expiresAt: Date;
};

export async function createSession(values: NewSessionValues): Promise<void> {
  const prisma = getPrisma();

  // Sessions that ended without a sign-out are removed the next time their owner signs in.
  await prisma.session.deleteMany({ where: { profileId: values.profileId, expiresAt: { lte: new Date() } } });
  await prisma.session.create({ data: values, select: { id: true } });
}

/** The owner of the session, or null when it does not exist, has expired or the profile is inactive. */
export async function findSessionUser(tokenHash: string): Promise<TeamMember | null> {
  const session = await getPrisma().session.findUnique({
    where: { tokenHash },
    select: { expiresAt: true, profile: { select: teamMemberSelect } },
  });

  if (!session || session.expiresAt <= new Date() || !session.profile.active) return null;

  return toTeamMember(session.profile);
}

export async function deleteSession(tokenHash: string): Promise<void> {
  await getPrisma().session.deleteMany({ where: { tokenHash } });
}
