import { ViewStyle } from 'react-native';
import { ColorPalette } from './colors';

export const glassStyle = (palette: ColorPalette, intensity: 'soft' | 'strong' = 'soft'): ViewStyle => ({
  backgroundColor:
    intensity === 'strong' ? palette.surfaceGlassStrong : palette.surfaceGlass,
  borderWidth: 1,
  borderColor: palette.border,
  borderRadius: 20,
  overflow: 'hidden',
});

export const neumorphStyle = (palette: ColorPalette): ViewStyle => ({
  backgroundColor: palette.surface,
  borderRadius: 20,
  shadowColor: palette.neumorphDark,
  shadowOffset: { width: 6, height: 8 },
  shadowOpacity: 0.45,
  shadowRadius: 14,
  elevation: 6,
});

export const insetNeumorph = (palette: ColorPalette): ViewStyle => ({
  backgroundColor: palette.surfaceHigh,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: palette.border,
});

export const elevatedCard = (palette: ColorPalette, level: 1 | 2 | 3 = 1): ViewStyle => {
  const radii = { 1: 18, 2: 22, 3: 28 } as const;
  const offsets = { 1: 6, 2: 10, 3: 18 } as const;
  return {
    backgroundColor: palette.surface,
    borderRadius: radii[level],
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: offsets[level] },
    shadowOpacity: 0.18,
    shadowRadius: offsets[level] + 6,
    elevation: offsets[level],
  };
};

export const hairlineBorder = (palette: ColorPalette): ViewStyle => ({
  borderWidth: 1,
  borderColor: palette.divider,
});

export const pillSurface = (palette: ColorPalette, accent: 'primary' | 'accent' = 'primary'): ViewStyle => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 999,
  backgroundColor: accent === 'primary' ? palette.primarySoft : palette.accentSoft,
});

export const focusRing = (palette: ColorPalette): ViewStyle => ({
  borderWidth: 2,
  borderColor: palette.primary,
  borderRadius: 14,
});
