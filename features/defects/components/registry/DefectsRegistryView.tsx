'use client';

import { useMemo } from 'react';
import { RegistryFilterPanel } from '@/features/defects/components/registry/RegistryFilterPanel';
import { RegistryTable } from '@/features/defects/components/registry/RegistryTable';
import { useDefectFilters } from '@/features/defects/context/DefectFiltersProvider';
import { useDefects } from '@/features/defects/context/DefectsProvider';
import { filterDefects } from '@/features/defects/lib/filterDefects';

export function DefectsRegistryView() {
  const { defects } = useDefects();
  const { filters } = useDefectFilters();
  const filteredDefects = useMemo(() => filterDefects(defects, filters), [defects, filters]);

  return (
    <div className="space-y-4">
      <RegistryFilterPanel filteredCount={filteredDefects.length} totalCount={defects.length} />
      <RegistryTable defects={filteredDefects} totalCount={defects.length} />
    </div>
  );
}
