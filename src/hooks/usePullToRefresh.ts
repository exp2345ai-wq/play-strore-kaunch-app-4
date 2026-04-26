import { useCallback, useState } from 'react';
import { sleep } from '../utils/helpers';

export const usePullToRefresh = (onRefresh?: () => Promise<void> | void) => {
  const [refreshing, setRefreshing] = useState(false);

  const trigger = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await sleep(900);
      }
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return { refreshing, trigger };
};
