import { FolderArchive } from 'lucide-react';
import { AttachedFileCard } from '@/features/new-defect/components/attachments/AttachedFileCard';
import { UploadDropzone } from '@/features/new-defect/components/attachments/UploadDropzone';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { createFinalZipFile } from '@/features/new-defect/lib/mockAttachments';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

/** Optional completed-case ZIP archive. */
export function FinalZipUpload() {
  const { darkMode, t } = useTheme();
  const { showToast } = useToast();
  const { draft, updateDraft } = useNewDefectDraft();

  const attach = () => {
    if (!draft.finalZipName) return;
    updateDraft({ finalZip: createFinalZipFile(draft.finalZipName), finalZipName: '' });
    showToast('Attached Optional Final Case ZIP file.');
  };

  return (
    <div className={`${t.innerBoxBg} p-4 rounded-lg border flex flex-col justify-between`}>
      <div>
        <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${t.dividerNeutral}`}>
          <span className="p-1.5 bg-amber-100 text-amber-700 rounded">
            <FolderArchive className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h5 className={`font-bold text-xs ${t.headingText}`}>Final ZIP</h5>
              <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.2 rounded font-semibold uppercase">
                Optional
              </span>
            </div>
            <p className={`text-[10px] ${t.mutedText}`}>Optional ZIP attachment for completed case pack</p>
          </div>
        </div>

        {draft.finalZip ? (
          <AttachedFileCard
            icon={FolderArchive}
            iconClassName="w-5 h-5 text-amber-600 flex-shrink-0"
            fileName={draft.finalZip.name}
            meta={<>{draft.finalZip.size} • ZIP Archive</>}
            removeTitle="Remove ZIP"
            onRemove={() => updateDraft({ finalZip: null })}
          />
        ) : (
          <UploadDropzone
            className={darkMode ? 'border-neutral-700 bg-[#0B1426]' : 'border-neutral-300 bg-white'}
            iconClassName="w-6 h-6 mx-auto text-neutral-400"
            title="Optional Final Case ZIP"
            subtitle="Attach complete dossier archive if available"
            placeholder="e.g. Case_Package_Final.zip"
            fileName={draft.finalZipName}
            onFileNameChange={(finalZipName) => updateDraft({ finalZipName })}
            onAttach={attach}
            attachButtonClassName="px-3 py-1.5 bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white font-bold rounded text-xs cursor-pointer"
          />
        )}
      </div>

      <div className={`text-[10px] ${t.mutedText} italic`}>Optional: You may proceed to Step 3 without uploading a ZIP file.</div>
    </div>
  );
}
