import { Check } from 'lucide-react';
import { DEFECT_REASONS } from '@/constants/defectReasons';
import { DEFECT_REASON_ICONS } from '@/features/defects/lib/defectReasonIcons';
import { useTheme } from '@/providers/ThemeProvider';
import type { DefectReasonCode } from '@/types/defect';

type EditReasonGridProps = {
  selected: DefectReasonCode | null;
  onSelect: (code: DefectReasonCode) => void;
};

/** Same single-select reason cards as the New Defect wizard, sized for the compact edit modal. */
export function EditReasonGrid({ selected, onSelect }: EditReasonGridProps) {
  const { darkMode } = useTheme();
  const unselectedClass = darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5" role="radiogroup" aria-label="Reason for Defect">
      {DEFECT_REASONS.map((reason) => {
        const Icon = DEFECT_REASON_ICONS[reason.code];
        const isSelected = selected === reason.code;
        return (
          <button
            key={reason.code}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(reason.code)}
            className={`flex items-center gap-1.5 p-2 rounded text-left text-[11px] border cursor-pointer ${
              isSelected ? 'bg-[#0757C9] text-white border-[#0757C9] font-bold' : unselectedClass
            }`}
          >
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#0757C9] dark:text-blue-400'}`} />
            <span className="truncate flex-1">{reason.label}</span>
            {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
