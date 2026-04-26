import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';

interface GlassCardProps {
  intensity?: number;
  tint?: 'default' | 'light' | 'dark';
  borderless?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  intensity = 35,
  tint,
  borderless = false,
  style,
  children,
}) => {
  const theme = useTheme();
  const resolvedTint = tint ?? (theme.mode === 'dark' ? 'dark' : 'light');

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderColor: borderless ? 'transparent' : theme.palette.border,
          backgroundColor: theme.palette.surfaceGlass,
          shadowColor: theme.palette.shadow,
        },
        style,
      ]}
    >
      <BlurView intensity={intensity} tint={resolvedTint} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  content: {
    padding: 16,
  },
});
