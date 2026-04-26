import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

export type GradientPreset =
  | 'primary'
  | 'aurora'
  | 'sunset'
  | 'ocean'
  | 'neon'
  | 'card'
  | 'cardSoft';

interface GradientBackgroundProps {
  preset?: GradientPreset;
  colors?: string[];
  style?: import('react-native').StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children?: React.ReactNode;
}

/**
 * Drop-in gradient background that respects the active theme.
 * Use `preset` for quick canonical gradients or pass `colors`
 * for one-off stops.
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  preset = 'primary',
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
}) => {
  const theme = useTheme();
  const gradients: Record<GradientPreset, string[]> = {
    primary: theme.palette.gradientPrimary,
    aurora: theme.palette.gradientAurora,
    sunset: theme.palette.gradientSunset,
    ocean: theme.palette.gradientOcean,
    neon: theme.palette.gradientNeon,
    card: theme.palette.gradientCard,
    cardSoft: theme.palette.gradientCardSoft,
  };
  const stops = colors ?? gradients[preset];

  return (
    <LinearGradient
      colors={stops}
      start={start}
      end={end}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
