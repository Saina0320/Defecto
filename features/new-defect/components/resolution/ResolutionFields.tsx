import { EvidenceFilesField } from '@/features/new-defect/components/resolution/EvidenceFilesField';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';

export function ResolutionFields() {
  const { t } = useTheme();
  const { teamUsers } = useTeam();
  const { draft, updateDraft, resolvedBy, setResolvedBy } = useNewDefectDraft();

  const labelClass = `block font-semibold ${t.headingText} mb-1`;
  const fieldClass = `w-full p-2.5 ${t.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs`;

  return (
    <div className={`p-4 ${t.innerBoxBg} rounded-lg border space-y-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="new-defect-corrective-action" className={labelClass}>
            Corrective Action Taken *
          </label>
          <input
            id="new-defect-corrective-action"
            type="text"
            required
            placeholder="e.g. Obtained certified registry certificate and refreshed profile"
            value={draft.correctiveAction}
            onChange={(e) => updateDraft({ correctiveAction: e.target.value })}
            className={`${fieldClass} font-medium`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="new-defect-resolved-by" className={labelClass}>
              Resolved By
            </label>
            <select
              id="new-defect-resolved-by"
              value={resolvedBy}
              onChange={(e) => setResolvedBy(e.target.value)}
              className={`${fieldClass} cursor-pointer`}
            >
              {teamUsers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="new-defect-resolution-date" className={labelClass}>
              Resolution Date
            </label>
            <input
              id="new-defect-resolution-date"
              type="date"
              value={draft.resolutionDate}
              onChange={(e) => updateDraft({ resolutionDate: e.target.value })}
              className={`${fieldClass} font-mono cursor-pointer`}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="new-defect-resolution-comment" className={labelClass}>
          Resolution Comment / Detailed Explanation *
        </label>
        <textarea
          id="new-defect-resolution-comment"
          rows={3}
          required
          placeholder="Explain how the defect was resolved and validated..."
          value={draft.resolutionComment}
          onChange={(e) => updateDraft({ resolutionComment: e.target.value })}
          className={fieldClass}
        />
      </div>

      <EvidenceFilesField />
    </div>
  );
}
