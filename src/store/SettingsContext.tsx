import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { storageKeys } from '../utils/storage';
import { AppSettings } from '../types';

const defaultSettings: AppSettings = {
  colorMode: 'system',
  accentColor: 'indigo',
  hapticsEnabled: true,
  soundEnabled: true,
  notificationsEnabled: true,
  emailMarketing: true,
  pushDeals: true,
  pushOrderUpdates: true,
  language: 'en',
  currency: 'INR',
  reduceMotion: false,
  highContrast: false,
  preferredFont: 'system',
};

interface SettingsContextValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  update: () => {},
  reset: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: settings, setValue } = useAsyncStorage<AppSettings>(
    storageKeys.settings,
    defaultSettings
  );

  const update = useCallback(
    (patch: Partial<AppSettings>) => {
      setValue((prev) => ({ ...prev, ...patch }));
    },
    [setValue]
  );

  const reset = useCallback(() => {
    setValue(defaultSettings);
  }, [setValue]);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
