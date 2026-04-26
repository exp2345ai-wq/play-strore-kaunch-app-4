import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface NeumorphicCardProps {
  inset?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

/**
 * Neumorphic ("soft UI") card that fakes the dual-light effect
 * through layered backgrounds and shadows. Honors light + dark
 * mode with two distinct shadow tones.
 */
export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  inset = false,
  style,
  children,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.outer,
        {
          backgroundColor: theme.palette.surface,
          shadowColor: theme.palette.neumorphDark,
          borderColor: theme.palette.border,
        },
        inset && {
          backgroundColor: theme.palette.surfaceHigh,
          shadowOpacity: 0,
          elevation: 0,
        },
        style,
      ]}
    >
      {!inset && (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              shadowColor: theme.palette.neumorphLight,
            },
          ]}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    shadowOffset: { width: -6, height: -8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  content: {
    padding: 16,
  },
});
