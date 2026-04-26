import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}) => {
  const theme = useTheme();
  const dim = size === 'sm' ? 30 : 36;
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border },
      ]}
    >
      <AnimatedTouchable
        onPress={() => onChange(Math.max(min, value - 1))}
        hapticKind="selection"
        style={[styles.btn, { width: dim, height: dim }]}
      >
        <Ionicons name="remove" size={16} color={theme.palette.text} />
      </AnimatedTouchable>
      <Text style={[theme.typography.bodyStrong, { color: theme.palette.text, paddingHorizontal: 14 }]}>
        {value}
      </Text>
      <AnimatedTouchable
        onPress={() => onChange(Math.min(max, value + 1))}
        hapticKind="selection"
        style={[styles.btn, { width: dim, height: dim }]}
      >
        <Ionicons name="add" size={16} color={theme.palette.text} />
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
});
