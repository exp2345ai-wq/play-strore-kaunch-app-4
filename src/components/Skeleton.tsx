import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '../theme/ThemeContext';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 14,
  radius = 8,
  style,
}) => {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + progress.value * 0.45,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: theme.palette.shimmerBase,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        skel.card,
        { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
      ]}
    >
      <Skeleton height={140} radius={14} />
      <Skeleton height={14} style={{ marginTop: 10, width: '60%' }} />
      <Skeleton height={18} style={{ marginTop: 6 }} />
      <Skeleton height={20} style={{ marginTop: 10, width: '40%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {},
});

const skel = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
});
