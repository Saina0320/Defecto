import type { ReactNode } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

type StepIntroProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function StepIntro({ icon, title, description }: StepIntroProps) {
  const { t } = useTheme();

  return (
    <div>
      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1 ${t.cyanTagText} flex items-center gap-1.5`}>
        {icon} {title}
      </h4>
      <p className={`text-[11px] ${t.mutedText}`}>{description}</p>
    </div>
  );
}
