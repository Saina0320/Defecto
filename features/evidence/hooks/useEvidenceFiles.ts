import { useMemo } from 'react';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { collectEvidenceFiles } from '@/features/evidence/lib/collectEvidenceFiles';

export function useEvidenceFiles() {
  const { defects } = useDefects();
  return useMemo(() => collectEvidenceFiles(defects), [defects]);
}
