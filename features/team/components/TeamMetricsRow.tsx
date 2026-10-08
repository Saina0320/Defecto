import { ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import type { TeamMember } from '@/types/team';

type TeamMetricsRowProps = { teamUsers: TeamMember[] };

/** Derived from the already-loaded roster — no new query. */
export function TeamMetricsRow({ teamUsers }: TeamMetricsRowProps) {
  const { t } = useTheme();
  const activeAnalysts = teamUsers.filter((member) => member.role === 'Analyst' && member.status === 'Active').length;
  const managers = teamUsers.filter((member) => member.role === 'Manager' || member.role === 'Admin').length;
  const inactive = teamUsers.filter((member) => member.status !== 'Active').length;

  const tiles = [
    { label: 'Active Analysts', value: activeAnalysts, icon: UserCheck, className: 'bg-blue-50 dark:bg-blue-900/40 text-[#0757C9] dark:text-[#4A9BFF]' },
    { label: 'Managers', value: managers, icon: ShieldCheck, className: 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
    { label: 'Inactive Members', value: inactive, icon: UserX, className: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div key={tile.label} className={`${t.cardBg} p-3 rounded-[14px] border flex items-center gap-2.5`}>
          <span className={`p-1.5 rounded-[8px] flex-shrink-0 ${tile.className}`}>
            <tile.icon className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className={`text-lg font-bold leading-tight ${t.headingText}`}>{tile.value}</div>
            <div className={`text-[10px] ${t.mutedText} truncate`}>{tile.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
