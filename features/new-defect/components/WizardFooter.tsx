import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNewDefectDraft } from '@/features/new-defect/context/NewDefectDraftProvider';
import type { WizardStep } from '@/features/new-defect/lib/draft';
import { useTheme } from '@/providers/ThemeProvider';

type WizardFooterProps = {
  /** Step targeted by the "Back to Step N" button; omitted on the first step. */
  backStep?: WizardStep;
  children: ReactNode;
};

export function WizardFooter({ backStep, children }: WizardFooterProps) {
  const { darkMode, t } = useTheme();
  const { updateDraft } = useNewDefectDraft();

  return (
    <div className={`flex ${backStep ? 'justify-between' : 'justify-end'} pt-4 border-t ${t.divider}`}>
      {backStep && (
        <button
          type="button"
          onClick={() => updateDraft({ step: backStep })}
          className={`px-4 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'} rounded font-semibold cursor-pointer`}
        >
          Back to Step {backStep}
        </button>
      )}
      {children}
    </div>
  );
}

export function WizardProceedButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-5 py-2.5 bg-[#0757C9] hover:bg-[#063B82] text-white font-bold rounded flex items-center gap-2 shadow transition cursor-pointer"
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
