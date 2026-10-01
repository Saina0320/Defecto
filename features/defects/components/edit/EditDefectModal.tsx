import { useState, type FormEvent } from 'react';
import { AlertTriangle, Edit3, Save, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { CASE_TYPES } from '@/constants/categories';
import { setCategories, type SetCategoriesResult } from '@/features/defects/actions';
import { EditCategoryGrid } from '@/features/defects/components/edit/EditCategoryGrid';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { toggleCategory } from '@/features/defects/lib/categories';
import { createEditDraft, finalizeEditedDefect, type DefectEditDraft } from '@/features/defects/lib/editDefect';
import { sanitizeCcid } from '@/features/defects/lib/identifiers';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect, DefectResolution } from '@/types/defect';

const CATEGORY_SAVE_ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'Permission denied: you can only edit defects you created.',
  'not-found': 'This defect no longer exists.',
  'invalid-categories': 'One or more selected categories are not valid for this case type.',
  'database-error': 'Could not save the categories. Try again.',
};

export function EditDefectModal({ defect }: { defect: Defect }) {
  const { darkMode, t } = useTheme();
  const { closeEdit, saveEdit } = useDefectDialogs();
  const [draft, setDraft] = useState<DefectEditDraft>(() => createEditDraft(defect));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const update = (patch: Partial<DefectEditDraft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const updateResolution = (patch: Partial<DefectResolution>) =>
    setDraft((prev) => ({ ...prev, resolution: { ...prev.resolution, ...patch } }));

  // Categories are persisted in PostgreSQL before anything else about the edit is applied
  // locally; the rest of the form (CCID, explanation, resolution, ...) stays local-only, as it
  // was before this fix — only category persistence was in scope.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!defect.id || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    const result: SetCategoriesResult = await setCategories(defect.id, draft.selectedCategories);
    setIsSaving(false);

    if (!result.ok) {
      setSaveError(CATEGORY_SAVE_ERROR_MESSAGES[result.reason] ?? 'Could not save the categories. Try again.');
      return;
    }

    saveEdit(defect.ccid, finalizeEditedDefect(draft));
  };

  const labelClass = `block font-semibold ${t.headingText} mb-1`;
  const secondaryButtonClass = darkMode
    ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100';

  return (
    <Modal className="max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
      <div className="p-4 bg-[#002D72] text-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-blue-300" />
            Edit Defect Record (Owner Management)
          </h3>
          <p className="text-[10px] text-blue-200">
            Editing CCID: {draft.ccid} | Owner: {draft.analystName}
          </p>
        </div>
        <button onClick={closeEdit} className="p-1 text-blue-200 hover:text-white rounded cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-ccid" className={labelClass}>
              CCID (16-Digits)
            </label>
            <input
              id="edit-ccid"
              type="text"
              maxLength={16}
              value={draft.ccid}
              onChange={(e) => update({ ccid: sanitizeCcid(e.target.value) })}
              className={`w-full p-2 ${t.inputBg} rounded font-mono font-bold text-xs`}
            />
          </div>
          <div>
            <label htmlFor="edit-kycid" className={labelClass}>
              KYCID
            </label>
            <input
              id="edit-kycid"
              type="text"
              value={draft.kycid}
              onChange={(e) => update({ kycid: e.target.value })}
              className={`w-full p-2 ${t.inputBg} rounded font-mono font-bold text-xs`}
            />
          </div>
        </div>

        <div>
          <span className={labelClass}>Case Type</span>
          <div className="grid grid-cols-2 gap-2">
            {CASE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update({ caseType: type })}
                className={`py-1.5 px-3 rounded font-bold text-xs border text-center transition cursor-pointer ${
                  draft.caseType === type
                    ? 'bg-[#003EA4] text-white border-[#003EA4]'
                    : darkMode
                      ? 'bg-[#0B1426] text-neutral-300 border-neutral-700'
                      : 'bg-white text-neutral-700 border-neutral-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="edit-explanation" className={labelClass}>
            Defect Explanation / Context
          </label>
          <textarea
            id="edit-explanation"
            rows={3}
            value={draft.explanation}
            onChange={(e) => update({ explanation: e.target.value })}
            className={`w-full p-2 ${t.inputBg} rounded text-xs`}
          />
        </div>

        <div>
          <span className={labelClass}>Categories / Areas Involved</span>
          <EditCategoryGrid
            caseType={draft.caseType}
            selected={draft.selectedCategories}
            onToggle={(section, name) => update({ selectedCategories: toggleCategory(draft.selectedCategories, section, name) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="edit-corrective-action" className={labelClass}>
              Corrective Action
            </label>
            <input
              id="edit-corrective-action"
              type="text"
              value={draft.resolution.correctiveAction}
              onChange={(e) => updateResolution({ correctiveAction: e.target.value })}
              className={`w-full p-2 ${t.inputBg} rounded text-xs`}
            />
          </div>
          <div>
            <label htmlFor="edit-resolution-comment" className={labelClass}>
              Resolution Comment
            </label>
            <input
              id="edit-resolution-comment"
              type="text"
              value={draft.resolution.comment}
              onChange={(e) => updateResolution({ comment: e.target.value })}
              className={`w-full p-2 ${t.inputBg} rounded text-xs`}
            />
          </div>
        </div>

        {saveError && (
          <p className="p-2 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 flex items-start gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-3.5 h-3.5 mt-px flex-shrink-0" />
            <span>{saveError}</span>
          </p>
        )}

        <div className={`flex justify-end gap-2 pt-3 border-t ${t.divider}`}>
          <button
            type="button"
            onClick={closeEdit}
            disabled={isSaving}
            className={`px-4 py-2 border ${secondaryButtonClass} rounded font-semibold cursor-pointer disabled:cursor-wait disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded flex items-center gap-1.5 shadow cursor-pointer disabled:cursor-wait disabled:bg-[#003EA4]/75 disabled:hover:bg-[#003EA4]/75"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
