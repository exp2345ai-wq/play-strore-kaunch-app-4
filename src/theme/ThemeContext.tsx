import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ColorPalette, darkPalette, lightPalette } from './colors';
import { typography, TypographyScale } from './typography';
import { spacing, radius, elevation, sizes, motion } from './spacing';
import { ColorMode } from '../types';

export interface Theme {
  mode: 'light' | 'dark';
  palette: ColorPalette;
  typography: TypographyScale;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  sizes: typeof sizes;
  motion: typeof motion;
}

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  setColorMode: (m: ColorMode) => void;
  toggle: () => void;
}

const STORAGE_KEY = '@shopx/colorMode';

const defaultTheme: Theme = {
  mode: 'dark',
  palette: darkPalette,
  typography,
  spacing,
  radius,
  elevation,
  sizes,
  motion,
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  colorMode: 'system',
  setColorMode: () => {},
  toggle: () => {},
});

const resolveSystemScheme = (override: ColorMode, system: ColorSchemeName): 'light' | 'dark' => {
  if (override === 'light') return 'light';
  if (override === 'dark') return 'dark';
  return system === 'light' ? 'light' : 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorModeState] = useState<ColorMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setColorModeState(stored);
        }
      })
      .catch(() => {});

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme ?? 'dark');
    });
    return () => sub.remove();
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setColorModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const theme = useMemo<Theme>(() => {
    const resolved = resolveSystemScheme(colorMode, systemScheme);
    return {
      mode: resolved,
      palette: resolved === 'light' ? lightPalette : darkPalette,
      typography,
      spacing,
      radius,
      elevation,
      sizes,
      motion,
    };
  }, [colorMode, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, colorMode, setColorMode, toggle }),
    [theme, colorMode, setColorMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => useContext(ThemeContext).theme;
export const useThemeControl = () => {
  const { colorMode, setColorMode, toggle } = useContext(ThemeContext);
  return { colorMode, setColorMode, toggle };
};
