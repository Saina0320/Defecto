import { useTheme } from '@/providers/ThemeProvider';
import type { TeamMember } from '@/types/team';

type TeamMemberCardProps = {
  member: TeamMember;
  handledDefects: number;
  /** Shown only to supervisors, for active analysts. */
  onDecommission?: () => void;
};

export function TeamMemberCard({ member, handledDefects, onDecommission }: TeamMemberCardProps) {
  const { darkMode, t } = useTheme();
  const isDecommissioned = member.status === 'Decommissioned';

  return (
    <div
      className={`${t.cardBg} p-4 rounded-[14px] border hover:shadow transition flex flex-col justify-between ${isDecommissioned ? 'opacity-60 border-dashed' : ''}`}
    >
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-[#0757C9] dark:text-blue-200 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
              {member.initials}
            </div>
            <div>
              <h5 className={`font-bold text-xs ${t.headingText}`}>{member.name}</h5>
              <span className={`text-[10px] ${t.mutedText}`}>• {member.role}</span>
            </div>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              isDecommissioned
                ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {member.status}
          </span>
        </div>

        <div className={`p-2 rounded text-[11px] mb-3 ${darkMode ? 'bg-[#0B1426]' : 'bg-neutral-50'} text-neutral-600 dark:text-neutral-300`}>
          <span className={t.mutedText}>Email: </span>
          {member.soeId ? (
            <span className={`font-mono ${!darkMode ? 'text-[#0056B3]' : ''}`}>{member.soeId.toLowerCase()}@citi.com</span>
          ) : (
            <span className="font-mono">{member.email}</span>
          )}
        </div>
      </div>

      <div className={`pt-2 border-t ${t.dividerSoft} flex items-center justify-between text-xs`}>
        <span className={t.mutedText}>
          Handled Defects: <strong className={t.headingText}>{handledDefects}</strong>
        </span>

        {onDecommission && (
          <button onClick={onDecommission} className="text-red-500 hover:text-red-700 text-[11px] font-semibold hover:underline cursor-pointer">
            Deactivate
          </button>
        )}
      </div>
    </div>
  );
}
