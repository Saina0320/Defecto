import type { Defect } from '@/types/defect';
import type { TeamMember, UserRole } from '@/types/team';

/** Managers and admins have supervisory access (team metrics, roster management, read matrix). */
export function isSupervisorRole(role: UserRole): boolean {
  return role === 'Manager' || role === 'Admin';
}

/** Supervisors can edit/delete any defect; analysts only the ones they own. */
export function canManageDefect(user: TeamMember, defect: Defect): boolean {
  return isSupervisorRole(user.role) || defect.ownerId === user.id;
}
