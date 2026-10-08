import { Shield, ShieldCheck, UserCheck, type LucideIcon } from 'lucide-react';
import { ROLE_DESCRIPTIONS } from '@/constants/team';
import { useTeam } from '@/features/team/context/TeamProvider';
import type { UserRole } from '@/types/team';

const ROLE_ICONS: Record<UserRole, { Icon: LucideIcon; className: string }> = {
  Admin: { Icon: Shield, className: 'w-3.5 h-3.5 text-amber-300' },
  Manager: { Icon: ShieldCheck, className: 'w-3.5 h-3.5 text-purple-300' },
  Analyst: { Icon: UserCheck, className: 'w-3.5 h-3.5 text-[#4A9BFF]' },
};

/**
 * Identity card at the top of the sidebar — a visual summary of the signed-in user only. It is
 * never a permission control: there is no role switcher here because none exists in the backend
 * (requireUser() always resolves the real authenticated profile), and inventing one would read as
 * a security control that does nothing.
 */
export function PersonaBanner() {
  const { currentUser } = useTeam();
  const { Icon, className } = ROLE_ICONS[currentUser.role];

  return (
    <div className="mx-3 mt-3 mb-1 p-3 rounded-[14px] bg-white/[0.06] border border-white/10 flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
        {currentUser.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
        <p className="text-[10px] text-blue-200/80 truncate">{ROLE_DESCRIPTIONS[currentUser.role]}</p>
      </div>
      <span className="p-1.5 rounded-[8px] bg-white/5 flex-shrink-0" title={currentUser.role}>
        <Icon className={className} />
      </span>
    </div>
  );
}
