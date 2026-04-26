import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { storageKeys } from '../utils/storage';
import { ID, WishlistEntry } from '../types';

interface WishlistContextValue {
  entries: WishlistEntry[];
  toggle: (productId: ID) => boolean;
  add: (productId: ID, notes?: string) => void;
  remove: (productId: ID) => void;
  clear: () => void;
  has: (productId: ID) => boolean;
}

const WishlistContext = createContext<WishlistContextValue>({
  entries: [],
  toggle: () => false,
  add: () => {},
  remove: () => {},
  clear: () => {},
  has: () => false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: entries, setValue } = useAsyncStorage<WishlistEntry[]>(
    storageKeys.wishlist,
    []
  );

  const has = useCallback(
    (productId: ID) => entries.some((e) => e.productId === productId),
    [entries]
  );

  const add = useCallback(
    (productId: ID, notes?: string) => {
      setValue((prev) => {
        if (prev.some((e) => e.productId === productId)) return prev;
        return [
          ...prev,
          {
            id: `wish-${productId}-${Date.now()}`,
            productId,
            notes,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [setValue]
  );

  const remove = useCallback(
    (productId: ID) => {
      setValue((prev) => prev.filter((e) => e.productId !== productId));
    },
    [setValue]
  );

  const toggle = useCallback(
    (productId: ID): boolean => {
      const exists = entries.some((e) => e.productId === productId);
      if (exists) {
        remove(productId);
        return false;
      }
      add(productId);
      return true;
    },
    [entries, add, remove]
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  const value = useMemo(
    () => ({ entries, toggle, add, remove, clear, has }),
    [entries, toggle, add, remove, clear, has]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
