import { FileText } from 'lucide-react';
import { AttachedFileCard } from '@/features/new-defect/components/attachments/AttachedFileCard';
import { UploadDropzone } from '@/features/new-defect/components/attachments/UploadDropzone';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { previewQcFindingsFile } from '@/features/new-defect/lib/attachmentPreview';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

/** Required QC findings file from the Checker. */
export function QcFindingsUpload() {
  const { darkMode, t } = useTheme();
  const { showToast } = useToast();
  const { currentUser } = useTeam();
  const { draft, updateDraft } = useNewDefectDraft();

  const attach = () => {
    if (!draft.qcFilePending) return;
    updateDraft({
      qcFile: previewQcFindingsFile(draft.qcFilePending, currentUser.name),
      qcFileRaw: draft.qcFilePending,
      qcFilePending: null,
    });
    showToast('Attached Checker QC Findings file.');
  };

  return (
    <div className={`${t.innerBoxBg} p-4 rounded-lg border flex flex-col justify-between`}>
      <div>
        <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${t.dividerNeutral}`}>
          <span className="p-1.5 bg-red-100 text-red-700 rounded">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h5 className={`font-bold text-xs ${t.headingText}`}>QC Findings *</h5>
            <p className={`text-[10px] ${t.mutedText}`}>Checker findings file provided by QC</p>
          </div>
        </div>

        {draft.qcFile ? (
          <AttachedFileCard
            icon={FileText}
            iconClassName="w-5 h-5 text-red-600 flex-shrink-0"
            fileName={draft.qcFile.name}
            meta={<>{draft.qcFile.size} • Uploaded</>}
            removeTitle="Remove file"
            onRemove={() => updateDraft({ qcFile: null, qcFileRaw: null })}
          />
        ) : (
          <UploadDropzone
            className={darkMode ? 'border-red-900/50 bg-[#0B1426]' : 'border-red-300/60 bg-white'}
            iconClassName="w-6 h-6 mx-auto text-red-600"
            title="Upload Checker Findings File"
            subtitle="PDF, DOCX, or scan file provided by QC Checker"
            inputId="qc-findings-file"
            accept=".pdf,.doc,.docx,image/*"
            pendingFile={draft.qcFilePending}
            onPendingFileChange={(qcFilePending) => updateDraft({ qcFilePending })}
            onAttach={attach}
            attachButtonClassName="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer"
          />
        )}
      </div>

      <div className="text-[10px] font-medium">
        Status: {draft.qcFile ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Attached</span> : <span className="text-red-600">Required file</span>}
      </div>
    </div>
  );
}
