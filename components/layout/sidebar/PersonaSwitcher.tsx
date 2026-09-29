import { ROLE_DESCRIPTIONS } from '@/constants/team';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getActiveAnalysts, getActiveSupervisors } from '@/features/team/lib/roster';
import { useResetDemoData } from '@/hooks/useResetDemoData';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';
import type { TeamMember } from '@/types/team';

function PersonaOption({ member }: { member: TeamMember }) {
  return (
    <option value={member.id}>
      {member.name} ({member.soeId})
    </option>
  );
}

/** Sidebar footer: simulated persona selector, demo reset and current user card. */
export function PersonaSwitcher() {
  const { t } = useTheme();
  const { teamUsers, currentUser, selectedUserId, selectUser } = useTeam();
  const { showToast } = useToast();
  const resetDemoData = useResetDemoData();

  const handleSelect = (userId: string) => {
    const member = selectUser(userId);
    if (member) {
      showToast(`Switched active persona to: ${member.name} (${member.role})`);
    }
  };

  return (
    <div className={`p-3 border-t ${t.sidebarHeader}`}>
      <div className="text-[11px] text-blue-300 uppercase tracking-wider font-semibold mb-2 px-1 flex items-center justify-between">
        <span>Simulate User Persona:</span>
        <button
          onClick={resetDemoData}
          className="text-[10px] text-blue-200 hover:text-white underline cursor-pointer"
          title="Reset state to initial prototype data"
        >
          Reset Data
        </button>
      </div>

      <select
        aria-label="Simulate user persona"
        value={selectedUserId ?? ''}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full mb-3 p-1.5 bg-[#00245E] text-white border border-blue-400/30 rounded text-xs"
      >
        <optgroup label="Management & Admin" className="bg-[#00245E] text-white">
          {getActiveSupervisors(teamUsers).map((member) => (
            <PersonaOption key={member.id} member={member} />
          ))}
        </optgroup>
        <optgroup label="Active Analysts (Record Owners)" className="bg-[#00245E] text-white">
          {getActiveAnalysts(teamUsers).map((member) => (
            <PersonaOption key={member.id} member={member} />
          ))}
        </optgroup>
      </select>

      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-[#003EA4] border border-blue-300 flex items-center justify-center font-bold text-xs text-white shadow-xs">
          {currentUser.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
          <p className="text-[10px] text-blue-300 truncate">{ROLE_DESCRIPTIONS[currentUser.role]}</p>
        </div>
      </div>
    </div>
  );
}
