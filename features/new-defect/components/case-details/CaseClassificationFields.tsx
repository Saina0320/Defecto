import { CASE_TYPES } from '@/constants/categories';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTeam } from '@/features/team/context/TeamProvider';
import { getActiveAnalysts } from '@/features/team/lib/roster';
import { useTheme } from '@/providers/ThemeProvider';

/** Case type, analyst and date row of step 1. */
export function CaseClassificationFields() {
  const { darkMode, t } = useTheme();
  const { teamUsers } = useTeam();
  const { draft, updateDraft, selectCaseType, analyst, setAnalyst } = useNewDefectDraft();

  const labelClass = `block font-semibold ${t.headingText} mb-1`;
  const unselectedTypeClass = darkMode
    ? 'bg-[#0B1426] text-neutral-300 border-neutral-700 hover:bg-[#1E2E4A]'
    : 'bg-white text-neutral-700 border-[#DEE2E6] hover:bg-neutral-50';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t ${t.dividerSoft}`}>
      <div>
        <span className={labelClass}>Case Type *</span>
        <div className="grid grid-cols-2 gap-2">
          {CASE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => selectCaseType(type)}
              className={`py-2 px-3 rounded font-bold text-xs border text-center transition cursor-pointer ${
                draft.caseType === type ? 'bg-[#0757C9] text-white border-[#0757C9] shadow-xs' : unselectedTypeClass
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="new-defect-analyst" className={labelClass}>
          Analyst *
        </label>
        <select
          id="new-defect-analyst"
          value={analyst}
          onChange={(e) => setAnalyst(e.target.value)}
          className={`w-full p-2.5 ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none font-medium cursor-pointer`}
        >
          {getActiveAnalysts(teamUsers).map((member) => (
            <option key={member.id} value={member.name}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="new-defect-date" className={labelClass}>
          Date *
        </label>
        <input
          id="new-defect-date"
          type="date"
          value={draft.date}
          onChange={(e) => updateDraft({ date: e.target.value })}
          className={`w-full p-2.5 ${t.inputBg} rounded focus:border-[#0757C9] focus:outline-none font-mono cursor-pointer`}
        />
      </div>
    </div>
  );
}
