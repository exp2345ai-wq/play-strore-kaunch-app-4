import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

type Variant = 'primary' | 'accent' | 'glass' | 'outline' | 'ghost' | 'danger';

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  hapticKind?: 'light' | 'medium' | 'success' | 'warning' | 'error';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  style,
  hapticKind = 'medium',
}) => {
  const theme = useTheme();
  const isPressable = !loading && !disabled;

  const sizeStyle = (() => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: 16, minHeight: 38 };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 24, minHeight: 60 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 20, minHeight: 52 };
    }
  })();

  const renderInner = (textColor: string) => (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {iconLeft ? <Ionicons name={iconLeft} size={18} color={textColor} style={styles.iconLeft} /> : null}
          <Text style={[styles.label, theme.typography.button, { color: textColor }]}>{title}</Text>
          {iconRight ? <Ionicons name={iconRight} size={18} color={textColor} style={styles.iconRight} /> : null}
        </>
      )}
    </View>
  );

  const baseStyle: ViewStyle = {
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.55 : 1,
  };

  if (variant === 'primary' || variant === 'accent') {
    const colors =
      variant === 'primary'
        ? theme.palette.gradientPrimary
        : [theme.palette.accent, theme.palette.accentStrong];
    return (
      <AnimatedTouchable
        onPress={isPressable ? onPress : undefined}
        hapticKind={hapticKind}
        style={[baseStyle, style]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyle]}
        >
          {renderInner(theme.palette.onPrimary)}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'danger') {
    return (
      <AnimatedTouchable
        onPress={isPressable ? onPress : undefined}
        hapticKind="error"
        style={[
          baseStyle,
          { backgroundColor: theme.palette.danger },
          sizeStyle,
          style,
        ]}
      >
        {renderInner('#FFFFFF')}
      </AnimatedTouchable>
    );
  }

  if (variant === 'glass') {
    return (
      <AnimatedTouchable
        onPress={isPressable ? onPress : undefined}
        hapticKind={hapticKind}
        style={[
          baseStyle,
          {
            backgroundColor: theme.palette.surfaceGlassStrong,
            borderColor: theme.palette.border,
            borderWidth: 1,
          },
          sizeStyle,
          style,
        ]}
      >
        {renderInner(theme.palette.text)}
      </AnimatedTouchable>
    );
  }

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        onPress={isPressable ? onPress : undefined}
        hapticKind={hapticKind}
        style={[
          baseStyle,
          {
            borderColor: theme.palette.primary,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
          sizeStyle,
          style,
        ]}
      >
        {renderInner(theme.palette.primary)}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={isPressable ? onPress : undefined}
      hapticKind={hapticKind}
      style={[baseStyle, sizeStyle, style]}
    >
      {renderInner(theme.palette.text)}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
