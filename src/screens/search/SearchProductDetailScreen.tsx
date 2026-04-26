import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { SearchStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findProduct, productsByCategory } from '../../data/products';
import { reviewsForProduct } from '../../data/reviews';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProductCard } from '../../components/ProductCard';
import { ReviewCard } from '../../components/ReviewCard';
import { RatingStars } from '../../components/RatingStars';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { SectionHeader } from '../../components/SectionHeader';
import { formatCompactNumber, formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchProductDetail'>;

export const SearchProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const product = findProduct(route.params.productId);
  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Product" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          We couldn't find that product.
        </Text>
      </View>
    );
  }

  const reviews = reviewsForProduct(product.id).slice(0, 6);
  const similar = productsByCategory(product.categoryId).filter((p) => p.id !== product.id).slice(0, 8);
  const wished = has(product.id);

  const onAdd = () => {
    haptic('success');
    add(product.id, [], product.price);
    Toast.show({ type: 'success', text1: 'Added to cart', text2: product.title });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Search match"
          rightSlot={
            <AnimatedTouchable
              hapticKind="selection"
              onPress={() => toggle(product.id)}
              style={[styles.iconBtn, { borderColor: theme.palette.border }]}
            >
              <Ionicons
                name={wished ? 'heart' : 'heart-outline'}
                size={18}
                color={wished ? theme.palette.accent : theme.palette.text}
              />
            </AnimatedTouchable>
          }
        />

        <View style={styles.heroWrap}>
          <Image source={{ uri: product.thumbnail }} style={styles.heroImage} />
          <LinearGradient
            colors={['#00000022', '#0000007A']}
            style={[StyleSheet.absoluteFill, { bottom: 0 }]}
          />
          <View style={styles.heroOverlay}>
            <Text style={[theme.typography.captionStrong, { color: '#FFFFFFCC' }]}>
              {product.brand.toUpperCase()} · {product.discountPercent}% OFF
            </Text>
            <Text style={[theme.typography.h2, { color: '#FFFFFF', marginTop: 4 }]} numberOfLines={2}>
              {product.title}
            </Text>
            <View style={styles.heroMeta}>
              <View style={[styles.heroMetaPill, { backgroundColor: '#FFFFFFEE' }]}>
                <Ionicons name="star" size={14} color={theme.palette.rating} />
                <Text style={[theme.typography.captionStrong, { color: '#0B0F1A', marginLeft: 4 }]}>
                  {product.rating.toFixed(1)}
                </Text>
              </View>
              <View style={[styles.heroMetaPill, { backgroundColor: '#FFFFFFEE' }]}>
                <Ionicons name="rocket" size={14} color={theme.palette.primary} />
                <Text style={[theme.typography.captionStrong, { color: '#0B0F1A', marginLeft: 4 }]}>
                  {product.deliveryEta}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <View style={[styles.priceCard, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.h2, { color: theme.palette.text }]}>
                {formatMoney(product.price)}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
                MRP {formatMoney(product.originalPrice)} · Save{' '}
                {Math.round(((product.originalPrice.amount - product.price.amount) / product.originalPrice.amount) * 100)}%
              </Text>
            </View>
            <View style={[styles.savingsPill, { backgroundColor: theme.palette.successSoft }]}>
              <Ionicons name="trending-down" size={14} color={theme.palette.success} />
              <Text style={[theme.typography.captionStrong, { color: theme.palette.success, marginLeft: 4 }]}>
                Best price in 30d
              </Text>
            </View>
          </View>

          <GlassCard style={{ marginTop: 12 }}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              About this product
            </Text>
            <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 8 }]}>
              {product.longDescription}
            </Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {product.highlights.map((h, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  <Ionicons name="checkmark" size={16} color={theme.palette.success} />
                  <Text style={[theme.typography.caption, { color: theme.palette.textSecondary, marginLeft: 8, flex: 1 }]}>
                    {h}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>

          <GlassCard style={{ marginTop: 12 }}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              At a glance · {product.rating.toFixed(1)} ★ ({formatCompactNumber(product.reviewCount)})
            </Text>
            <RatingStars rating={product.rating} size={16} showLabel style={{ marginTop: 8 }} />
            <View style={{ marginTop: 14 }}>
              {reviews.slice(0, 3).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </View>
          </GlassCard>
        </View>

        <SectionHeader title="People also bought" icon="basket" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {similar.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="horizontal"
              onPress={() => navigation.push('SearchProductDetail', { productId: p.id })}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <PrimaryButton title="Add to cart" iconLeft="bag-handle" variant="glass" onPress={onAdd} fullWidth={false} style={{ flex: 1 }} />
        <PrimaryButton title="Buy now" iconLeft="flash" variant="primary" onPress={onAdd} fullWidth={false} style={{ flex: 1, marginLeft: 12 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroWrap: { width: '100%', aspectRatio: 1.5, backgroundColor: '#0001' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 },
  heroMeta: { flexDirection: 'row', gap: 8, marginTop: 12 },
  heroMetaPill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  priceCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1 },
  savingsPill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
