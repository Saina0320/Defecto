import { Building2 } from 'lucide-react';
import { normalizeKycidInput, sanitizeCcid } from '@/features/defects/lib/identifiers';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';

export function CaseIdentifierFields() {
  const { darkMode, t } = useTheme();
  const { draft, updateDraft } = useNewDefectDraft();

  return (
    <div>
      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${t.cyanTagText} flex items-center gap-1.5`}>
        <Building2 className="w-4 h-4" /> 1. Primary Case Identifiers
      </h4>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'bg-[#0B1426]/70 border-[#1E2E4A]' : 'bg-blue-50/40 border-blue-100'} p-4 rounded-lg border`}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="new-defect-ccid" className={`font-semibold ${t.headingText}`}>
              CCID (16-Digit Numeric ID) *
            </label>
            <span className={`text-[10px] ${t.mutedText} font-mono`}>{draft.ccid.length}/16 digits</span>
          </div>
          <input
            id="new-defect-ccid"
            type="text"
            required
            maxLength={16}
            placeholder="e.g. 1234567890123456"
            value={draft.ccid}
            onChange={(e) => updateDraft({ ccid: sanitizeCcid(e.target.value) })}
            className={`w-full p-2.5 ${t.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-mono font-bold text-xs tracking-wider`}
          />
          <p className={`text-[10px] ${t.mutedText} mt-1`}>Stored exactly as entered (numeric only). No prefix added.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="new-defect-kycid" className={`font-semibold ${t.headingText}`}>
              KYCID (from KIWI with KYC- prefix) *
            </label>
            <span className={`text-[10px] ${t.mutedText} font-mono`}>As provided in KIWI</span>
          </div>
          <input
            id="new-defect-kycid"
            type="text"
            required
            placeholder="e.g. KYC-123456789012"
            value={draft.kycid}
            onChange={(e) => updateDraft({ kycid: normalizeKycidInput(e.target.value) })}
            className={`w-full p-2.5 ${t.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-mono font-bold text-xs`}
          />
          <p className={`text-[10px] ${t.mutedText} mt-1`}>Preserved exactly as provided in KIWI (includes KYC-).</p>
        </div>
      </div>
    </div>
  );
}
