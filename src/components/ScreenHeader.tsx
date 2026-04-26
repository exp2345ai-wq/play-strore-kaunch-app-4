import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { IconButton } from './IconButton';
import { useTheme } from '../theme/ThemeContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  rightSlot,
  variant = 'default',
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const canBack = showBack && navigation.canGoBack();
  return (
    <View
      style={[
        styles.row,
        variant === 'glass' && {
          backgroundColor: theme.palette.surfaceGlass,
          borderColor: theme.palette.border,
          borderBottomWidth: 1,
        },
      ]}
    >
      {canBack ? (
        <IconButton icon="chevron-back" onPress={() => navigation.goBack()} variant="glass" />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="sparkles" size={20} color={theme.palette.primary} />
        </View>
      )}
      <View style={styles.titleWrap}>
        <Text style={[theme.typography.h3, { color: theme.palette.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  titleWrap: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  placeholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
