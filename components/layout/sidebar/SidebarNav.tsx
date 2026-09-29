import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileCheck, Plus, ShieldAlert, Users, type LucideIcon } from 'lucide-react';
import { ROUTES, type AppRoute } from '@/constants/routes';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { useEvidenceFiles } from '@/features/evidence/hooks/useEvidenceFiles';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getActiveAnalysts } from '@/features/team/lib/roster';

type NavItem = {
  href: AppRoute;
  label: string;
  icon: LucideIcon;
  badge: string | number | null;
  badgeClassName?: string;
};

export function SidebarNav() {
  const pathname = usePathname();
  const { defects } = useDefects();
  const { teamUsers } = useTeam();
  const evidenceFiles = useEvidenceFiles();

  const items: NavItem[] = [
    { href: ROUTES.overview, label: 'Overview', icon: BarChart3, badge: null },
    { href: ROUTES.defects, label: 'Defects Registry', icon: ShieldAlert, badge: defects.length },
    { href: ROUTES.newDefect, label: 'New Defect', icon: Plus, badge: '3-Step Form', badgeClassName: 'bg-[#E21836] text-white' },
    { href: ROUTES.evidence, label: 'Evidence Vault', icon: FileCheck, badge: `${evidenceFiles.length} files` },
    { href: ROUTES.team, label: 'Team & Roster', icon: Users, badge: `${getActiveAnalysts(teamUsers).length} Analysts` },
  ];

  return (
    <nav className="px-3 space-y-1">
      {items.map(({ href, label, icon: Icon, badge, badgeClassName }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium text-center transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#003EA4] text-white shadow-md font-semibold border-l-4 border-white'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
              <span>{label}</span>
            </div>
            {badge !== null && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeClassName || 'bg-white/15 text-blue-100'}`}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
