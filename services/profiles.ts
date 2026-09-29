import { createClient } from '@/lib/supabase/client';
import type { ProfileRow } from '@/types/database';
import type { TeamMember, UserRole } from '@/types/team';

function toUserRole(role: string): UserRole {
  if (role === 'admin') return 'Admin';
  if (role === 'manager') return 'Manager';
  return 'Analyst';
}

function toTeamMember(profile: ProfileRow): TeamMember {
  return {
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`,
    soeId: profile.soe_id,
    role: toUserRole(profile.role),
    email: profile.soe_id,
    status: profile.active ? 'Active' : 'Inactive',
    initials: `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase(),
  };
}

export async function getActiveProfiles(): Promise<TeamMember[]> {
  const { data, error } = await createClient()
    .from('profiles')
    .select('*')
    .eq('active', true)
    .order('first_name');

  if (error) {
    throw error;
  }

  return (data || []).map(toTeamMember);
}

/** Looks up a profile by "First Last" name. Returns null (and logs) when not found. */
export async function findProfileIdByFullName(fullName: string): Promise<string | null> {
  const [firstName, ...lastNameParts] = fullName.split(' ');

  const { data, error } = await createClient()
    .from('profiles')
    .select('id')
    .eq('first_name', firstName)
    .eq('last_name', lastNameParts.join(' '))
    .single();

  if (error || !data) {
    console.error('Error finding analyst:', error);
    return null;
  }

  return data.id;
}
