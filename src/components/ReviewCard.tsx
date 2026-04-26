import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Review } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { RatingStars } from './RatingStars';
import { formatRelativeTime } from '../utils/format';
import { AnimatedTouchable } from './AnimatedTouchable';

interface ReviewCardProps {
  review: Review;
  onPress?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onPress }) => {
  const theme = useTheme();
  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="light"
      style={[
        styles.card,
        { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
      ]}
    >
      <View style={styles.headerRow}>
        <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            {review.userName}
          </Text>
          <View style={styles.metaRow}>
            <RatingStars rating={review.rating} size={12} />
            <Text style={[theme.typography.micro, { color: theme.palette.textMuted, marginLeft: 6 }]}>
              {formatRelativeTime(review.createdAt)}
            </Text>
            {review.verifiedPurchase ? (
              <View style={[styles.badge, { backgroundColor: theme.palette.successSoft }]}>
                <Ionicons name="checkmark-circle" size={11} color={theme.palette.success} />
                <Text style={[theme.typography.micro, { color: theme.palette.success, marginLeft: 4 }]}>
                  Verified
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <Text style={[theme.typography.bodyStrong, { color: theme.palette.text, marginTop: 10 }]}>
        {review.title}
      </Text>
      <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 6 }]}>
        {review.comment}
      </Text>
      {review.images.length > 0 ? (
        <View style={styles.imagesRow}>
          {review.images.map((src) => (
            <Image key={src} source={{ uri: src }} style={styles.reviewImage} />
          ))}
        </View>
      ) : null}
      <View style={styles.helpfulRow}>
        <View style={styles.helpful}>
          <Ionicons name="thumbs-up" size={14} color={theme.palette.textMuted} />
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginLeft: 6 }]}>
            Helpful · {review.helpful}
          </Text>
        </View>
        <View style={styles.helpful}>
          <Ionicons name="thumbs-down" size={14} color={theme.palette.textMuted} />
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginLeft: 6 }]}>
            {review.unhelpful}
          </Text>
        </View>
      </View>
      {review.reply ? (
        <View style={[styles.reply, { backgroundColor: theme.palette.primarySoft }]}>
          <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
            {review.reply.author} replied
          </Text>
          <Text style={[theme.typography.caption, { color: theme.palette.textSecondary, marginTop: 4 }]}>
            {review.reply.content}
          </Text>
        </View>
      ) : null}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  imagesRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  reviewImage: { width: 60, height: 60, borderRadius: 10 },
  helpfulRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  helpful: { flexDirection: 'row', alignItems: 'center' },
  reply: { padding: 10, borderRadius: 10, marginTop: 12 },
});
