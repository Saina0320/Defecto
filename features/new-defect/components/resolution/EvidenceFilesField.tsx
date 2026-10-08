import { FileText, X } from 'lucide-react';
import { UploadDropzone } from '@/features/new-defect/components/attachments/UploadDropzone';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { previewEvidenceFile } from '@/features/new-defect/lib/attachmentPreview';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

/** Optional supporting documents for the resolution. */
export function EvidenceFilesField() {
  const { darkMode, t } = useTheme();
  const { showToast } = useToast();
  const { currentUser } = useTeam();
  const { draft, updateDraft } = useNewDefectDraft();

  const addFile = () => {
    if (!draft.evidencePending) return;
    updateDraft({
      evidenceFiles: [...draft.evidenceFiles, previewEvidenceFile(draft.evidencePending, currentUser.name)],
      evidenceFilesRaw: [...draft.evidenceFilesRaw, draft.evidencePending],
      evidencePending: null,
    });
    showToast('Added resolution evidence file.');
  };

  const removeFile = (index: number) => {
    updateDraft({
      evidenceFiles: draft.evidenceFiles.filter((_, i) => i !== index),
      evidenceFilesRaw: draft.evidenceFilesRaw.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={`pt-2 border-t ${t.dividerNeutral}`}>
      <label htmlFor="new-defect-evidence" className={`block font-semibold ${t.headingText} mb-1`}>
        Optional Resolution Evidence (Supporting Docs)
      </label>

      <UploadDropzone
        className={darkMode ? 'border-blue-900/50 bg-[#0B1426]' : 'border-blue-300/60 bg-white'}
        iconClassName="w-6 h-6 mx-auto text-blue-600"
        title="Add Supporting Evidence"
        subtitle="Drag & drop a file here, or click to browse"
        inputId="new-defect-evidence"
        pendingFile={draft.evidencePending}
        onPendingFileChange={(evidencePending) => updateDraft({ evidencePending })}
        onAttach={addFile}
        onRejected={(message) => showToast(message)}
        attachButtonClassName={`px-3 py-1.5 ${darkMode ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-800'} hover:opacity-90 font-semibold rounded text-xs cursor-pointer`}
        attachLabel="+ Add File"
      />

      {draft.evidenceFiles.length > 0 && (
        <div className="space-y-1">
          {draft.evidenceFiles.map((file, index) => (
            <div key={index} className={`flex items-center justify-between p-2 ${t.cardBg} rounded border ${t.dividerNeutral} text-xs`}>
              <span className={`font-semibold ${t.headingText} flex items-center gap-1.5`}>
                <FileText className="w-3.5 h-3.5 text-blue-600" /> {file.name} ({file.size})
              </span>
              <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
