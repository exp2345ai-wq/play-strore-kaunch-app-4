import { Easing, withSpring, withTiming } from 'react-native-reanimated';

export const springFast = () => withSpring(1, { damping: 22, stiffness: 320, mass: 0.7 });
export const springSoft = () => withSpring(1, { damping: 16, stiffness: 180, mass: 0.9 });
export const springBouncy = () => withSpring(1, { damping: 8, stiffness: 200, mass: 0.7 });

export const fadeIn = (duration = 220) =>
  withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
export const fadeOut = (duration = 180) =>
  withTiming(0, { duration, easing: Easing.in(Easing.cubic) });

export const slideUp = (_offset = 12, duration = 240) =>
  withTiming(0, { duration, easing: Easing.out(Easing.exp) });

export const easeInOut = Easing.bezier(0.4, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeStandard = Easing.bezier(0.2, 0, 0, 1);

export const SCALE_PRESS = 0.96;
export const SCALE_REST = 1;
export const SCALE_HOVER = 1.03;
