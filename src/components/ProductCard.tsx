import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Product } from '../types';
import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';
import { useWishlist } from '../store/WishlistContext';
import { useHaptics } from '../hooks/useHaptics';
import { formatMoney, formatCompactNumber } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onPressWishlist?: () => void;
  variant?: 'grid' | 'horizontal' | 'wide';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onPressWishlist,
  variant = 'grid',
}) => {
  const theme = useTheme();
  const { has, toggle } = useWishlist();
  const haptic = useHaptics();
  const wished = has(product.id);

  const handleWishlist = () => {
    haptic('selection');
    toggle(product.id);
    onPressWishlist?.();
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="light"
      style={[
        styles.card,
        variant === 'horizontal' ? { width: 220 } : null,
        variant === 'wide' ? { width: '100%' as const } : null,
        {
          backgroundColor: theme.palette.surface,
          shadowColor: theme.palette.shadow,
          borderColor: theme.palette.border,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} />
        {product.discountPercent > 0 ? (
          <LinearGradient
            colors={[theme.palette.accentStrong, theme.palette.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.discountBadge}
          >
            <Text style={[theme.typography.micro, { color: theme.palette.onAccent }]}>
              {product.discountPercent}% OFF
            </Text>
          </LinearGradient>
        ) : null}
        <AnimatedTouchable
          onPress={handleWishlist}
          hapticKind="selection"
          style={[
            styles.wishlistBtn,
            { backgroundColor: theme.palette.surfaceGlassStrong, borderColor: theme.palette.border },
          ]}
        >
          <Ionicons
            name={wished ? 'heart' : 'heart-outline'}
            size={18}
            color={wished ? theme.palette.accent : theme.palette.text}
          />
        </AnimatedTouchable>
        {!product.inStock ? (
          <View style={[styles.outOfStock, { backgroundColor: theme.palette.danger }]}>
            <Text style={[theme.typography.micro, { color: '#FFFFFF' }]}>Sold out</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text
          style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 2 }]}
          numberOfLines={2}
        >
          {product.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[theme.typography.h4, { color: theme.palette.text }]}>
            {formatMoney(product.price)}
          </Text>
          {product.discountPercent > 0 ? (
            <Text
              style={[
                theme.typography.caption,
                {
                  color: theme.palette.textMuted,
                  textDecorationLine: 'line-through',
                  marginLeft: 8,
                },
              ]}
            >
              {formatMoney(product.originalPrice)}
            </Text>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.ratingPill, { backgroundColor: theme.palette.successSoft }]}>
            <Ionicons name="star" size={12} color={theme.palette.success} />
            <Text
              style={[
                theme.typography.captionStrong,
                { color: theme.palette.success, marginLeft: 4 },
              ]}
            >
              {product.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginLeft: 6 }]}>
            ({formatCompactNumber(product.reviewCount)})
          </Text>
          {product.freeShipping ? (
            <View style={[styles.shippingPill, { backgroundColor: theme.palette.primarySoft }]}>
              <Ionicons name="rocket" size={10} color={theme.palette.primary} />
              <Text
                style={[
                  theme.typography.micro,
                  { color: theme.palette.primary, marginLeft: 4 },
                ]}
              >
                Free
              </Text>
            </View>
          ) : null}
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  imageWrapper: {
    aspectRatio: 1,
    width: '100%',
    backgroundColor: '#0001',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  outOfStock: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  body: {
    padding: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shippingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
});
