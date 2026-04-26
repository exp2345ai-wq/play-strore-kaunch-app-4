import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettings } from '../store/SettingsContext';

export type HapticKind =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'soft'
  | 'rigid'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

export const useHaptics = () => {
  const { settings } = useSettings();
  const enabled = settings.hapticsEnabled;

  return useCallback(
    (kind: HapticKind = 'light') => {
      if (!enabled) return;
      try {
        switch (kind) {
          case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'soft':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            break;
          case 'rigid':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            break;
          case 'selection':
            Haptics.selectionAsync();
            break;
          case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      } catch {
        // some platforms (web) won't support haptics; silently ignore.
      }
    },
    [enabled]
  );
};
