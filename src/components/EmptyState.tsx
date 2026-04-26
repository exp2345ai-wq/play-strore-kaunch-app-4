import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeContext';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  ctaLabel?: string;
  onPressCTA?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '✨',
  icon,
  title,
  description,
  ctaLabel,
  onPressCTA,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={theme.palette.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBubble}
      >
        {icon ? (
          <Ionicons name={icon} size={32} color={theme.palette.onPrimary} />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </LinearGradient>
      <Text style={[theme.typography.h3, { color: theme.palette.text, marginTop: 18, textAlign: 'center' }]}>
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.palette.textMuted,
              marginTop: 6,
              textAlign: 'center',
              maxWidth: 320,
            },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {ctaLabel ? (
        <View style={styles.ctaWrap}>
          <PrimaryButton title={ctaLabel} onPress={onPressCTA} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  iconBubble: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 38 },
  ctaWrap: { marginTop: 24 },
});
