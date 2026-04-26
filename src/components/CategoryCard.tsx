import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Category } from '../types';
import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';
import { formatCompactNumber } from '../utils/format';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, size = 'md' }) => {
  const theme = useTheme();
  const dim = size === 'sm' ? 90 : size === 'lg' ? 150 : 116;
  return (
    <AnimatedTouchable onPress={onPress} hapticKind="selection" style={{ width: dim }}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.thumbBg}
        >
          <Image source={{ uri: category.thumbnail }} style={styles.thumb} />
          <Text style={styles.emoji}>{category.emoji}</Text>
        </LinearGradient>
        <View style={styles.body}>
          <Text style={[theme.typography.captionStrong, { color: theme.palette.text }]} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={[theme.typography.micro, { color: theme.palette.textMuted, marginTop: 2 }]}>
            {formatCompactNumber(category.productCount)} items
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbBg: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: '100%', height: '100%', opacity: 0.45 },
  emoji: {
    position: 'absolute',
    fontSize: 38,
  },
  body: { padding: 8, alignItems: 'center' },
});
