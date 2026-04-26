import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showLabel?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 14,
  showLabel = false,
  style,
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.row, style]}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i + 1 <= Math.round(rating);
        const half = !filled && i + 0.5 <= rating;
        return (
          <Ionicons
            key={i}
            name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
            size={size}
            color={theme.palette.rating}
            style={{ marginRight: 1 }}
          />
        );
      })}
      {showLabel ? (
        <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginLeft: 6 }]}>
          {rating.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
