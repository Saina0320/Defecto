import type { Metadata } from 'next';
import { TeamView } from '@/features/team/components/TeamView';

export const metadata: Metadata = {
  title: 'Team & Roster',
};

export default function TeamPage() {
  return <TeamView />;
}
