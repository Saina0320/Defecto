import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileCheck, LineChart, Plus, ShieldAlert, Users, type LucideIcon } from 'lucide-react';
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

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function SidebarNav() {
  const pathname = usePathname();
  const { defects } = useDefects();
  const { teamUsers } = useTeam();
  const evidenceFiles = useEvidenceFiles();

  const groups: NavGroup[] = [
    {
      label: 'Workspace',
      items: [
        { href: ROUTES.overview, label: 'Overview', icon: BarChart3, badge: null },
        { href: ROUTES.defects, label: 'Defects Registry', icon: ShieldAlert, badge: defects.length },
        { href: ROUTES.newDefect, label: 'New Defect', icon: Plus, badge: null },
      ],
    },
    {
      label: 'Records & Insights',
      items: [
        { href: ROUTES.evidence, label: 'Evidence Vault', icon: FileCheck, badge: `${evidenceFiles.length} files` },
        { href: ROUTES.analytics, label: 'Analytics', icon: LineChart, badge: null },
      ],
    },
    {
      // Grouping label only — Team & Roster stays open to every role, same as before this
      // redesign; per-action authorization (Add/Deactivate Analyst) is unchanged and still
      // enforced inside TeamView/features/team/actions.ts, not by hiding this link.
      label: 'Administration',
      items: [{ href: ROUTES.team, label: 'Team & Roster', icon: Users, badge: `${getActiveAnalysts(teamUsers).length} Analysts` }],
    },
  ];

  return (
    <nav className="px-3 space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3.5 mb-1.5 text-[10px] font-bold tracking-[0.08em] uppercase text-blue-300/60">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon, badge, badgeClassName }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative w-full flex items-center justify-between pl-4 pr-3 py-2 rounded-[10px] text-xs font-medium transition-colors duration-150 cursor-pointer ${
                    isActive ? 'bg-white/10 text-white font-semibold' : 'text-blue-100/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#4A9BFF]" />}
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#4A9BFF]' : 'text-blue-300/70'}`} />
                    <span>{label}</span>
                  </div>
                  {badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${badgeClassName || 'bg-white/10 text-blue-100/90'}`}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
