import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';
import { useTheme } from '../theme/ThemeContext';

export const ToastHost: React.FC = () => {
  const theme = useTheme();
  const config = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={[
          styles.toast,
          {
            borderLeftColor: theme.palette.success,
            backgroundColor: theme.palette.surface,
            borderColor: theme.palette.border,
          },
        ]}
        text1Style={[theme.typography.subtitle, { color: theme.palette.text }]}
        text2Style={[theme.typography.caption, { color: theme.palette.textMuted }]}
      />
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={[
          styles.toast,
          {
            borderLeftColor: theme.palette.danger,
            backgroundColor: theme.palette.surface,
            borderColor: theme.palette.border,
          },
        ]}
        text1Style={[theme.typography.subtitle, { color: theme.palette.text }]}
        text2Style={[theme.typography.caption, { color: theme.palette.textMuted }]}
      />
    ),
    info: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={[
          styles.toast,
          {
            borderLeftColor: theme.palette.primary,
            backgroundColor: theme.palette.surface,
            borderColor: theme.palette.border,
          },
        ]}
        text1Style={[theme.typography.subtitle, { color: theme.palette.text }]}
        text2Style={[theme.typography.caption, { color: theme.palette.textMuted }]}
      />
    ),
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Toast config={config as any} />
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    borderRadius: 14,
    borderWidth: 1,
    height: 'auto',
    paddingVertical: 12,
  },
});
