export type UserRole = 'Admin' | 'Manager' | 'Analyst';

export type MemberStatus = 'Active' | 'Inactive' | 'Decommissioned';

export type TeamMember = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  initials: string;
  status: MemberStatus;
  /** SOE identifier; only present for members loaded from Supabase. */
  soeId?: string;
};
