import { Plus } from 'lucide-react';
import type { WizardStep } from '@/features/new-defect/lib/draft';

export function WizardHeader({ step }: { step: WizardStep }) {
  return (
    <div className="p-5 bg-gradient-to-r from-[#0757C9] to-[#063B82] text-white flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white/20 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">KYC Defect Intake Workflow</span>
          <span className="text-xs text-blue-200">Post-QC Case Logging</span>
        </div>
        <h3 className="text-base font-bold flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-200" />
          New KYC Defect Intake
        </h3>
        <p className="text-xs text-blue-100 mt-0.5">
          Step 1 (Enter Defect) → Step 2 (QC Findings & Final ZIP) → Step 3 (Resolution & Review)
        </p>
      </div>
      <div className="text-right">
        <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-semibold">Workflow Step</span>
        <span className="text-xl font-bold text-white">{step} of 3</span>
      </div>
    </div>
  );
}
