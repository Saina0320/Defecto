import type { MemberStatus, TeamMember, UserRole } from '@/types/team';

const USER_ROLES: readonly UserRole[] = ['Admin', 'Manager', 'Analyst'];
const MEMBER_STATUSES: readonly MemberStatus[] = ['Active', 'Inactive', 'Decommissioned'];

export function getAnalysts(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.role === 'Analyst');
}

export function getActiveAnalysts(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.role === 'Analyst' && user.status === 'Active');
}

/** Members expected to acknowledge defects: every active non-admin. */
export function getAcknowledgmentAudience(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.status === 'Active' && user.role !== 'Admin');
}

/** The Citi email shown in the Add Analyst form: derived from the SOEID, never entered or stored. */
export function toCitiEmail(soeId: string): string {
  return `${soeId.trim().toLowerCase()}@citi.com`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return options.some((option) => option === value);
}

function parseStoredMember(value: unknown): TeamMember | null {
  if (!isRecord(value)) return null;
  const { id, name, role, email, initials, status } = value;
  if (typeof id !== 'string' || typeof name !== 'string') return null;
  if (!isOneOf(USER_ROLES, role) || !isOneOf(MEMBER_STATUSES, status)) return null;

  // The original prototype stored the SOE id as `soe_id`.
  const soeId = typeof value.soeId === 'string' ? value.soeId : typeof value.soe_id === 'string' ? value.soe_id : undefined;

  return {
    id,
    name,
    role,
    email: typeof email === 'string' ? email : '',
    initials: typeof initials === 'string' ? initials : '',
    status,
    ...(soeId !== undefined && { soeId }),
  };
}

/** Validates a roster read from localStorage, dropping malformed entries. */
export function parseStoredTeam(value: unknown): TeamMember[] | null {
  if (!Array.isArray(value)) return null;
  return value.map(parseStoredMember).filter((member): member is TeamMember => member !== null);
}
