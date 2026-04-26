import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  badgeCount?: number;
  variant?: 'glass' | 'soft' | 'ghost' | 'filled';
  color?: string;
  style?: StyleProp<ViewStyle>;
  hapticKind?: 'light' | 'medium' | 'selection';
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  badgeCount,
  variant = 'glass',
  color,
  style,
  hapticKind = 'light',
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      variant === 'glass'
        ? theme.palette.surfaceGlassStrong
        : variant === 'soft'
          ? theme.palette.primarySoft
          : variant === 'filled'
            ? theme.palette.primary
            : 'transparent',
    borderWidth: variant === 'glass' ? 1 : 0,
    borderColor: theme.palette.border,
  };
  const iconColor =
    color ??
    (variant === 'filled'
      ? theme.palette.onPrimary
      : variant === 'soft'
        ? theme.palette.primary
        : theme.palette.text);

  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind={hapticKind}
      style={[containerStyle, style]}
      accessibilityLabel={accessibilityLabel ?? icon}
    >
      <Ionicons name={icon} size={Math.round(size * 0.45)} color={iconColor} />
      {badgeCount !== undefined && badgeCount > 0 ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.palette.accent, borderColor: theme.palette.background },
          ]}
        >
          <View style={styles.badgeInner}>
            <View style={styles.badgeText}>
              <Ionicons
                name="ellipse"
                size={6}
                color={theme.palette.accent}
                style={{ opacity: 0 }}
              />
            </View>
          </View>
        </View>
      ) : null}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  badgeText: {},
});
