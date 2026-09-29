import type { MemberStatus, TeamMember, UserRole } from '@/types/team';

const USER_ROLES: readonly UserRole[] = ['Admin', 'Manager', 'Analyst'];
const MEMBER_STATUSES: readonly MemberStatus[] = ['Active', 'Inactive', 'Decommissioned'];

export function getAnalysts(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.role === 'Analyst');
}

export function getActiveAnalysts(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.role === 'Analyst' && user.status === 'Active');
}

export function getActiveSupervisors(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.status === 'Active' && (user.role === 'Manager' || user.role === 'Admin'));
}

/** Members expected to acknowledge defects: every active non-admin. */
export function getAcknowledgmentAudience(users: TeamMember[]): TeamMember[] {
  return users.filter((user) => user.status === 'Active' && user.role !== 'Admin');
}

export function createAnalystMember(users: TeamMember[], name: string, email: string): TeamMember {
  const nextNumber = getAnalysts(users).length + 1;
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return {
    id: `ANL-${String(nextNumber).padStart(2, '0')}`,
    name: name.trim(),
    role: 'Analyst',
    email: email.trim(),
    initials: initials || 'AN',
    status: 'Active',
  };
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
