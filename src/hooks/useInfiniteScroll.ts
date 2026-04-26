import { useCallback, useEffect, useState } from 'react';
import { sleep } from '../utils/helpers';

export interface InfiniteState<T> {
  items: T[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  page: number;
}

export const useInfiniteScroll = <T,>(
  source: T[],
  pageSize = 12,
  simulatedDelay = 600
) => {
  const [state, setState] = useState<InfiniteState<T>>({
    items: [],
    loading: false,
    refreshing: false,
    hasMore: source.length > 0,
    page: 0,
  });

  const loadInitial = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, page: 0 }));
    await sleep(simulatedDelay);
    const slice = source.slice(0, pageSize);
    setState({
      items: slice,
      loading: false,
      refreshing: false,
      hasMore: slice.length < source.length,
      page: 1,
    });
  }, [source, pageSize, simulatedDelay]);

  const loadMore = useCallback(async () => {
    setState((s) => {
      if (s.loading || !s.hasMore) return s;
      return { ...s, loading: true };
    });
    await sleep(simulatedDelay);
    setState((prev) => {
      const start = prev.page * pageSize;
      const next = source.slice(start, start + pageSize);
      const combined = [...prev.items, ...next];
      return {
        ...prev,
        items: combined,
        loading: false,
        hasMore: combined.length < source.length,
        page: prev.page + 1,
      };
    });
  }, [source, pageSize, simulatedDelay]);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, refreshing: true, page: 0 }));
    await sleep(simulatedDelay);
    const slice = source.slice(0, pageSize);
    setState({
      items: slice,
      loading: false,
      refreshing: false,
      hasMore: slice.length < source.length,
      page: 1,
    });
  }, [source, pageSize, simulatedDelay]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return { ...state, loadMore, refresh };
};
