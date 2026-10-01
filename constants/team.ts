import type { UserRole } from '@/types/team';

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  Manager: 'Team Lead (Manager)',
  Admin: 'Administrator',
  Analyst: 'KYC Analyst (Owner Permissions)',
};

// Denominator shown next to read counts ("3/16"): the size of the original demo team
// (1 manager + 15 analysts). It is not recalculated from the live roster.
export const ACKNOWLEDGMENT_TARGET = 16;
