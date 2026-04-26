import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  icon,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <View style={styles.titleRow}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={theme.palette.primary}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text style={[theme.typography.h3, { color: theme.palette.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text
            style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <AnimatedTouchable onPress={onActionPress} hapticKind="light" style={styles.action}>
          <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
            {actionLabel}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={theme.palette.primary}
            style={{ marginLeft: 2 }}
          />
        </AnimatedTouchable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 12,
  },
  text: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  action: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
});
