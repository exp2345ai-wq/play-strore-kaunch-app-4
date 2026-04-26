import { useCallback, useEffect, useRef, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

export const useAsyncStorage = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    readJSON<T>(key, fallback).then((v) => {
      if (active) {
        setValue(v);
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, [key]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
        writeQueue.current = writeQueue.current.then(() => writeJSON(key, next));
        return next;
      });
    },
    [key]
  );

  return { value, setValue: update, hydrated };
};
