import React, { useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useHaptics, HapticKind } from '../hooks/useHaptics';

export interface AnimatedTouchableProps extends Omit<PressableProps, 'onPress' | 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  hapticKind?: HapticKind;
  pressedScale?: number;
  disabledHaptic?: boolean;
}

/**
 * The single source of truth for "tap-to-do-something" interactions in the
 * app. Wrap whatever you want to make tappable in this component and it
 * gets the on-brand spring + haptic combo for free.
 */
export const AnimatedTouchable: React.FC<AnimatedTouchableProps> = ({
  children,
  style,
  onPress,
  hapticKind = 'light',
  pressedScale = 0.96,
  disabledHaptic = false,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const haptic = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(pressedScale, {
      damping: 18,
      stiffness: 320,
      mass: 0.6,
    });
    opacity.value = withSpring(0.9, { damping: 18, stiffness: 320, mass: 0.6 });
  }, [scale, opacity, pressedScale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 240, mass: 0.7 });
    opacity.value = withSpring(1, { damping: 14, stiffness: 240, mass: 0.7 });
  }, [scale, opacity]);

  const handlePress = useCallback(() => {
    if (!disabledHaptic) {
      haptic(hapticKind);
    }
    onPress?.();
  }, [disabledHaptic, haptic, hapticKind, onPress]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
};
