import { Edit3, FileText, FolderArchive, Trash2, X } from 'lucide-react';
import { CaseTypeBadge } from '@/features/defects/components/CaseTypeBadge';
import { CategoryBadge } from '@/features/defects/components/CategoryBadge';
import { DrawerFileCard } from '@/features/defects/components/detail/DrawerFileCard';
import { DrawerSection } from '@/features/defects/components/detail/DrawerSection';
import { ReadAcknowledgmentSection } from '@/features/defects/components/detail/ReadAcknowledgmentSection';
import { useDefectDialogs } from '@/features/defects/context/DefectDialogsProvider';
import { formatCcidDisplay } from '@/features/defects/lib/identifiers';
import { useTeam } from '@/features/team/context/TeamProvider';
import { canManageDefect } from '@/lib/permissions';
import { useTheme } from '@/providers/ThemeProvider';
import type { Defect } from '@/types/defect';

export function DefectDetailDrawer({ defect }: { defect: Defect }) {
  const { darkMode, t } = useTheme();
  const { currentUser } = useTeam();
  const { closeDetails, openEdit, requestDelete } = useDefectDialogs();
  const { resolution } = defect;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div
        className={`w-full max-w-xl ${t.cardBg} h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 border-l ${t.divider}`}
      >
        <div>
          <div className="p-5 bg-[#002D72] text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold">CCID: {formatCcidDisplay(defect.ccid)}</span>
                <CaseTypeBadge caseType={defect.caseType} className="text-[10px] px-2 py-0.5 rounded font-semibold" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">{defect.kycid}</h3>
              <p className="text-xs text-blue-200 font-medium">
                Logged by {defect.analystName} on {defect.dateCreated}
              </p>
            </div>
            <button onClick={closeDetails} className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs">
            <DrawerSection title="1. Analyst Explanation & Case Context">
              <div className={`p-3 rounded border ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-blue-50/40 border-blue-100'}`}>
                <p className={`text-xs ${t.headingText} leading-relaxed`}>{defect.explanation}</p>
              </div>
            </DrawerSection>

            <DrawerSection title="Selected Involved Areas">
              <div className="flex flex-wrap gap-1.5">
                {defect.selectedCategories.map((category, index) => (
                  <CategoryBadge key={index} category={category} className="inline-flex items-center px-2 py-0.5 rounded text-[11px]" />
                ))}
              </div>
            </DrawerSection>

            <DrawerSection title="2. QC Findings Document (from Checker)">
              {defect.qcFile ? (
                <DrawerFileCard
                  icon={FileText}
                  iconClassName="w-5 h-5 text-red-500 flex-shrink-0"
                  evidenceId={defect.qcFile.id}
                  fileName={defect.qcFile.name}
                  meta={<>{defect.qcFile.size} • Uploaded {defect.qcFile.uploadDate || defect.dateCreated}</>}
                  downloadTitle="Download QC Findings"
                />
              ) : (
                <p className={`text-[11px] ${t.mutedText} italic`}>No QC findings file attached.</p>
              )}
            </DrawerSection>

            <DrawerSection title="Final Case Package ZIP">
              {defect.finalZipFile ? (
                <DrawerFileCard
                  icon={FolderArchive}
                  iconClassName="w-5 h-5 text-amber-500 flex-shrink-0"
                  evidenceId={defect.finalZipFile.id}
                  fileName={defect.finalZipFile.name}
                  meta={<>{defect.finalZipFile.size} • ZIP Archive</>}
                  downloadTitle="Download ZIP"
                />
              ) : (
                <p className={`text-[11px] ${t.mutedText} italic`}>Optional final ZIP was not attached for this record.</p>
              )}
            </DrawerSection>

            <DrawerSection title="3. Resolution & Corrective Action">
              <div className={`p-3 rounded border space-y-2 ${t.innerBoxBg}`}>
                <div>
                  <span className={`font-semibold ${t.mutedText} block text-[10px] uppercase`}>Corrective Action:</span>
                  <p className={`text-xs ${t.headingText}`}>{resolution?.correctiveAction || 'None specified'}</p>
                </div>
                <div>
                  <span className={`font-semibold ${t.mutedText} block text-[10px] uppercase`}>Resolution Comment:</span>
                  <p className={`text-xs ${t.headingText}`}>{resolution?.comment || 'None specified'}</p>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-200 dark:border-neutral-700 text-[10px]">
                  <span className={t.mutedText}>
                    Resolved By: <strong className={t.headingText}>{resolution?.resolvedBy || defect.analystName}</strong>
                  </span>
                  <span className={t.mutedText}>
                    Date: <strong className={t.headingText}>{resolution?.resolutionDate || defect.dateCreated}</strong>
                  </span>
                </div>
              </div>

              {resolution && resolution.evidenceFiles.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {resolution.evidenceFiles.map((file) => (
                    <DrawerFileCard
                      key={file.id}
                      icon={FileText}
                      iconClassName="w-5 h-5 text-blue-500 flex-shrink-0"
                      evidenceId={file.id}
                      fileName={file.name}
                      meta={file.size}
                      downloadTitle="Download Resolution Evidence"
                    />
                  ))}
                </div>
              )}
            </DrawerSection>

            <DrawerSection title="4. Read & Acknowledgment Status">
              <ReadAcknowledgmentSection defect={defect} />
            </DrawerSection>
          </div>
        </div>

        <div className={`p-4 ${t.headerBg} border-t flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {canManageDefect(currentUser, defect) && (
              <>
                <button
                  onClick={() => openEdit(defect)}
                  className="px-3 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Defect</span>
                </button>
                <button
                  onClick={() => requestDelete(defect)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={closeDetails}
            className={`px-4 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'} rounded text-xs font-semibold cursor-pointer`}
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
