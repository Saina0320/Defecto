import type { ReactNode } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTheme();

  return (
    <div>
      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${t.cyanTagText}`}>{title}</h4>
      {children}
    </div>
  );
}
