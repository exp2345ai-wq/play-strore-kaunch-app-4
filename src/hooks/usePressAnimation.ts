import { useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SCALE_PRESS, SCALE_REST } from '../utils/animations';

export const usePressAnimation = (pressedScale = SCALE_PRESS) => {
  const scale = useSharedValue(SCALE_REST);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(pressedScale, { damping: 18, stiffness: 320, mass: 0.6 });
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(SCALE_REST, { damping: 14, stiffness: 240, mass: 0.7 });
  }, [scale]);

  return { animatedStyle, onPressIn, onPressOut };
};
