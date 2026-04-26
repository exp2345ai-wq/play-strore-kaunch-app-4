import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeContext';
import { AnimatedTouchable } from './AnimatedTouchable';

export interface QuickAction {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint?: 'primary' | 'danger' | 'success' | 'warning';
  onPress: () => void;
}

export interface QuickActionSheetHandle {
  open: () => void;
  close: () => void;
}

interface QuickActionSheetProps {
  title: string;
  description?: string;
  actions: QuickAction[];
}

export const QuickActionSheet = forwardRef<QuickActionSheetHandle, QuickActionSheetProps>(
  ({ title, description, actions }, ref) => {
    const theme = useTheme();
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => [`${Math.min(70, 28 + actions.length * 8)}%`], [actions.length]);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.55}
          />
        )}
        backgroundStyle={{ backgroundColor: theme.palette.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.palette.divider }}
      >
        <BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text style={[theme.typography.h3, { color: theme.palette.text }]}>{title}</Text>
          {description ? (
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
              {description}
            </Text>
          ) : null}
          <View style={{ marginTop: 14 }}>
            {actions.map((a) => {
              const tint =
                a.tint === 'danger'
                  ? theme.palette.danger
                  : a.tint === 'success'
                    ? theme.palette.success
                    : a.tint === 'warning'
                      ? theme.palette.warning
                      : theme.palette.primary;
              return (
                <AnimatedTouchable
                  key={a.key}
                  onPress={() => {
                    sheetRef.current?.close();
                    a.onPress();
                  }}
                  hapticKind="selection"
                  style={[
                    styles.actionRow,
                    {
                      borderColor: theme.palette.border,
                      backgroundColor: theme.palette.surfaceHigh,
                    },
                  ]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: `${tint}22` }]}>
                    <Ionicons name={a.icon} size={18} color={tint} />
                  </View>
                  <Text style={[theme.typography.subtitle, { color: theme.palette.text, flex: 1 }]}>
                    {a.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
                </AnimatedTouchable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

QuickActionSheet.displayName = 'QuickActionSheet';

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
