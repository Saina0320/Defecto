import { Shield, ShieldCheck, UserCheck, type LucideIcon } from 'lucide-react';
import { useTeam } from '@/features/team/context/TeamProvider';
import type { UserRole } from '@/types/team';

const ROLE_ICONS: Record<UserRole, { Icon: LucideIcon; className: string }> = {
  Admin: { Icon: Shield, className: 'w-3.5 h-3.5 text-amber-400' },
  Manager: { Icon: ShieldCheck, className: 'w-3.5 h-3.5 text-purple-300' },
  Analyst: { Icon: UserCheck, className: 'w-3.5 h-3.5 text-blue-300' },
};

/** Active persona summary at the top of the sidebar. */
export function PersonaBanner() {
  const { currentUser } = useTeam();
  const { Icon, className } = ROLE_ICONS[currentUser.role];

  return (
    <div className="mx-3 my-3 p-3 rounded bg-white/5 border border-white/10 shadow-inner">
      <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Icon className={className} />
          Role: {currentUser.role}
        </span>
        <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
          {currentUser.role === 'Analyst' ? 'Analyst View' : 'Supervisory View'}
        </span>
      </div>
      <div className="text-[11px] text-blue-300/80 flex justify-between pt-1 border-t border-white/5">
        <span className="truncate max-w-[120px]">{currentUser.name}</span>
        <span className="font-mono text-[10px]">({currentUser.role})</span>
      </div>
    </div>
  );
}
