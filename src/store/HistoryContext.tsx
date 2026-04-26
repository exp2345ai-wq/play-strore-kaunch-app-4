import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { storageKeys } from '../utils/storage';
import { ID } from '../types';

interface HistoryContextValue {
  recentSearches: string[];
  viewedProducts: ID[];
  pushSearch: (q: string) => void;
  clearSearches: () => void;
  pushView: (productId: ID) => void;
  clearViews: () => void;
}

const HistoryContext = createContext<HistoryContextValue>({
  recentSearches: [],
  viewedProducts: [],
  pushSearch: () => {},
  clearSearches: () => {},
  pushView: () => {},
  clearViews: () => {},
});

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: recentSearches, setValue: setRecent } = useAsyncStorage<string[]>(
    storageKeys.recentSearches,
    []
  );
  const { value: viewedProducts, setValue: setViewed } = useAsyncStorage<ID[]>(
    storageKeys.history,
    []
  );

  const pushSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setRecent((prev) => {
        const filtered = prev.filter((p) => p.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, 20);
      });
    },
    [setRecent]
  );

  const clearSearches = useCallback(() => setRecent([]), [setRecent]);

  const pushView = useCallback(
    (productId: ID) => {
      setViewed((prev) => {
        const filtered = prev.filter((p) => p !== productId);
        return [productId, ...filtered].slice(0, 50);
      });
    },
    [setViewed]
  );

  const clearViews = useCallback(() => setViewed([]), [setViewed]);

  const value = useMemo(
    () => ({ recentSearches, viewedProducts, pushSearch, clearSearches, pushView, clearViews }),
    [recentSearches, viewedProducts, pushSearch, clearSearches, pushView, clearViews]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = () => useContext(HistoryContext);
