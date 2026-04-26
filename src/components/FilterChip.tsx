import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  count?: number;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active = false,
  onPress,
  icon,
  count,
}) => {
  const theme = useTheme();
  const bg = active ? theme.palette.primary : theme.palette.surfaceHigh;
  const fg = active ? theme.palette.onPrimary : theme.palette.text;
  const border = active ? theme.palette.primary : theme.palette.border;

  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="selection"
      style={[
        styles.chip,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      {icon ? <Ionicons name={icon} size={14} color={fg} style={{ marginRight: 6 }} /> : null}
      <Text style={[theme.typography.captionStrong, { color: fg }]}>{label}</Text>
      {count !== undefined ? (
        <View style={[styles.pill, { backgroundColor: active ? '#fff2' : theme.palette.background }]}>
          <Text style={[theme.typography.micro, { color: fg }]}>{count}</Text>
        </View>
      ) : null}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  pill: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
});
