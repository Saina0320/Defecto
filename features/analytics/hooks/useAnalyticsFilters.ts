import { useCallback, useState } from 'react';
import type { AnalyticsFilters } from '@/types/analytics';

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  dateRangePreset: 'LAST_30_DAYS',
  customFrom: null,
  customTo: null,
  analystId: null,
  category: null,
  reason: null,
};

/** In-memory only — Analytics filters are never persisted to storage, they reset on reload by design. */
export function useAnalyticsFilters() {
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_ANALYTICS_FILTERS);

  const updateFilters = useCallback((patch: Partial<AnalyticsFilters>) => setFilters((prev) => ({ ...prev, ...patch })), []);
  const resetFilters = useCallback(() => setFilters(DEFAULT_ANALYTICS_FILTERS), []);

  return { filters, updateFilters, resetFilters };
}
