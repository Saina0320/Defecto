'use client';

import { FileCheck, UploadCloud } from 'lucide-react';
import { EvidenceTable } from '@/features/evidence/components/EvidenceTable';
import { useEvidenceFiles } from '@/features/evidence/hooks/useEvidenceFiles';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

export function EvidenceVaultView() {
  const { t } = useTheme();
  const { showToast } = useToast();
  const evidenceFiles = useEvidenceFiles();

  return (
    <div className="space-y-4">
      <div className={`${t.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h3 className={`font-bold text-sm ${t.headingText} flex items-center gap-2`}>
            <FileCheck className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
            Evidence & Findings Document Vault
          </h3>
          <p className={`text-xs ${t.mutedText} mt-0.5`}>
            Centralized repository for Checker findings files, completed case ZIP archives, and resolution documents.
          </p>
        </div>
        <button
          onClick={() => showToast('Simulated Document Upload')}
          className="px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <EvidenceTable files={evidenceFiles} />
    </div>
  );
}
