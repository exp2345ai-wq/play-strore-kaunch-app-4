import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { storageKeys } from '../utils/storage';
import { Address, ID } from '../types';
import { initialAddresses } from '../data/addresses';

interface AddressContextValue {
  addresses: Address[];
  defaultAddress: Address | undefined;
  upsert: (a: Address) => void;
  remove: (id: ID) => void;
  setDefault: (id: ID) => void;
}

const AddressContext = createContext<AddressContextValue>({
  addresses: [],
  defaultAddress: undefined,
  upsert: () => {},
  remove: () => {},
  setDefault: () => {},
});

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: addresses, setValue } = useAsyncStorage<Address[]>(
    storageKeys.addresses,
    initialAddresses
  );

  const upsert = useCallback(
    (a: Address) => {
      setValue((prev) => {
        const idx = prev.findIndex((x) => x.id === a.id);
        if (idx === -1) {
          if (a.isDefault) {
            return [{ ...a }, ...prev.map((p) => ({ ...p, isDefault: false }))];
          }
          return [...prev, a];
        }
        const next = [...prev];
        next[idx] = a;
        if (a.isDefault) {
          return next.map((p) => (p.id === a.id ? p : { ...p, isDefault: false }));
        }
        return next;
      });
    },
    [setValue]
  );

  const remove = useCallback(
    (id: ID) => {
      setValue((prev) => prev.filter((x) => x.id !== id));
    },
    [setValue]
  );

  const setDefault = useCallback(
    (id: ID) => {
      setValue((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
    },
    [setValue]
  );

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0],
    [addresses]
  );

  const value = useMemo(
    () => ({ addresses, defaultAddress, upsert, remove, setDefault }),
    [addresses, defaultAddress, upsert, remove, setDefault]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export const useAddresses = () => useContext(AddressContext);
