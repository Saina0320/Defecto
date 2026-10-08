import { useEffect, useState } from 'react';
import { getAnalyticsData } from '@/features/analytics/actions';
import type { AnalyticsData, AnalyticsFilters } from '@/types/analytics';

type AnalyticsDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: AnalyticsData };

const LOADING_STATE: AnalyticsDataState = { status: 'loading' };

/** Fetches aggregated Analytics data from the server whenever filters change. Never holds raw defects. */
export function useAnalyticsData(filters: AnalyticsFilters): AnalyticsDataState {
  // Pairs the last-settled state with the filters it was fetched for. Comparing that to the
  // current `filters` (below) derives "a fetch is in flight" during render instead of calling
  // setState synchronously inside the effect, which cascades an extra render on every filter change.
  const [settled, setSettled] = useState<{ filters: AnalyticsFilters; state: AnalyticsDataState }>({
    filters,
    state: LOADING_STATE,
  });

  useEffect(() => {
    let cancelled = false;

    getAnalyticsData(filters)
      .then((result) => {
        if (cancelled) return;
        setSettled({
          filters,
          state: result.ok ? { status: 'ready', data: result.data } : { status: 'error', message: 'Could not load Analytics for the selected filters.' },
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Error loading Analytics data:', error);
        setSettled({ filters, state: { status: 'error', message: 'Could not load Analytics. Please try again.' } });
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return settled.filters === filters ? settled.state : LOADING_STATE;
}
