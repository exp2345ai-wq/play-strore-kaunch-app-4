import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { useHistory } from '../../store/HistoryContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findProduct, productsByCategory } from '../../data/products';
import { reviewsForProduct } from '../../data/reviews';

import { ScreenHeader } from '../../components/ScreenHeader';
import { ProductCard } from '../../components/ProductCard';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ReviewCard } from '../../components/ReviewCard';
import { RatingStars } from '../../components/RatingStars';
import { FilterChip } from '../../components/FilterChip';
import { SectionHeader } from '../../components/SectionHeader';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

import { formatMoney, formatCompactNumber } from '../../utils/format';
import { Skeleton } from '../../components/Skeleton';
import { sleep } from '../../utils/helpers';

const { width: SCREEN_W } = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { pushView } = useHistory();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [loadingExtras, setLoadingExtras] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'highlights' | 'shipping'>('highlights');
  const galleryRef = useRef<FlatList<string>>(null);

  const product = findProduct(route.params.productId);
  const reviews = useMemo(
    () => (product ? reviewsForProduct(product.id) : []),
    [product]
  );
  const similar = useMemo(() => {
    if (!product) return [];
    return productsByCategory(product.categoryId)
      .filter((p) => p.id !== product.id)
      .slice(0, 8);
  }, [product]);

  useEffect(() => {
    if (product) pushView(product.id);
    let cancelled = false;
    (async () => {
      await sleep(450);
      if (!cancelled) setLoadingExtras(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [product, pushView]);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Product" />
        <Text
          style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}
        >
          We couldn't find this product. Try going back to your last screen.
        </Text>
      </View>
    );
  }

  const wished = has(product.id);
  const sizeVariants = product.variants.filter((v) => v.type !== 'color');
  const colorVariants = product.variants.filter((v) => v.type === 'color');
  const ratingHistogram = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.max(0, Math.min(4, r.rating - 1));
      buckets[idx] += 1;
    });
    const total = buckets.reduce((a, b) => a + b, 0);
    return buckets.map((c) => ({ count: c, percent: total ? Math.round((c * 100) / total) : 0 }));
  }, [reviews]);

  const handleAddToCart = useCallback(() => {
    haptic('success');
    add(product.id, [], product.price);
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: product.title,
      position: 'top',
    });
  }, [add, haptic, product]);

  const handleBuyNow = useCallback(() => {
    haptic('medium');
    navigation.navigate('VariantSelection', { productId: product.id });
  }, [haptic, navigation, product.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <ScreenHeader
          title="Product details"
          showBack
          rightSlot={
            <>
              <AnimatedTouchable
                onPress={() => {
                  haptic('selection');
                  toggle(product.id);
                }}
                hapticKind="selection"
                style={[
                  styles.iconBtn,
                  { borderColor: theme.palette.border },
                ]}
              >
                <Ionicons
                  name={wished ? 'heart' : 'heart-outline'}
                  size={18}
                  color={wished ? theme.palette.accent : theme.palette.text}
                />
              </AnimatedTouchable>
              <AnimatedTouchable
                onPress={() => Toast.show({ type: 'info', text1: 'Share sheet coming soon' })}
                hapticKind="light"
                style={[
                  styles.iconBtn,
                  { borderColor: theme.palette.border },
                ]}
              >
                <Ionicons name="share-outline" size={18} color={theme.palette.text} />
              </AnimatedTouchable>
            </>
          }
        />

        <View style={styles.galleryWrap}>
          <FlatList
            ref={galleryRef}
            data={product.images}
            keyExtractor={(s) => s}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
              setGalleryIndex(next);
            }}
            renderItem={({ item }) => (
              <View style={[styles.galleryImageWrap, { width: SCREEN_W }]}>
                <Image source={{ uri: item }} style={styles.galleryImage} />
              </View>
            )}
          />
          <View style={styles.galleryDots}>
            {product.images.map((src, i) => (
              <View
                key={src}
                style={[
                  styles.galleryDot,
                  {
                    backgroundColor:
                      i === galleryIndex ? theme.palette.primary : theme.palette.divider,
                    width: i === galleryIndex ? 18 : 6,
                  },
                ]}
              />
            ))}
          </View>
          {product.discountPercent > 0 ? (
            <LinearGradient
              colors={[theme.palette.accent, theme.palette.accentStrong]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.galleryBadge}
            >
              <Text style={[theme.typography.captionStrong, { color: '#FFFFFF' }]}>
                {product.discountPercent}% OFF
              </Text>
            </LinearGradient>
          ) : null}
        </View>

        <View style={styles.info}>
          <View style={styles.brandRow}>
            <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
              {product.brand.toUpperCase()}
            </Text>
            <View style={[styles.skuPill, { backgroundColor: theme.palette.surfaceHigh }]}>
              <Text style={[theme.typography.micro, { color: theme.palette.textMuted }]}>
                {product.sku}
              </Text>
            </View>
          </View>
          <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 6 }]}>
            {product.title}
          </Text>
          <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 6 }]}>
            {product.subtitle}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[theme.typography.display, { color: theme.palette.text }]}>
              {formatMoney(product.price)}
            </Text>
            {product.discountPercent > 0 ? (
              <Text
                style={[
                  theme.typography.body,
                  {
                    color: theme.palette.textMuted,
                    textDecorationLine: 'line-through',
                    marginLeft: 10,
                  },
                ]}
              >
                {formatMoney(product.originalPrice)}
              </Text>
            ) : null}
            <View style={[styles.savingsPill, { backgroundColor: theme.palette.successSoft }]}>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.success }]}>
                You save ₹{(product.originalPrice.amount - product.price.amount).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: theme.palette.successSoft }]}>
              <Ionicons name="star" size={12} color={theme.palette.success} />
              <Text style={[theme.typography.captionStrong, { color: theme.palette.success, marginLeft: 4 }]}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginLeft: 8 }]}>
              {formatCompactNumber(product.reviewCount)} reviews
            </Text>
            <View style={{ flex: 1 }} />
            {product.freeShipping ? (
              <View style={[styles.metaPill, { backgroundColor: theme.palette.primarySoft }]}>
                <Ionicons name="rocket" size={12} color={theme.palette.primary} />
                <Text style={[theme.typography.captionStrong, { color: theme.palette.primary, marginLeft: 4 }]}>
                  Free shipping
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {colorVariants.length > 0 ? (
          <View style={styles.section}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Color · {colorVariants[0]?.value}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingTop: 10 }}
            >
              {colorVariants.map((v) => (
                <AnimatedTouchable
                  key={v.id}
                  hapticKind="selection"
                  onPress={() => navigation.navigate('VariantSelection', { productId: product.id })}
                >
                  <View
                    style={[
                      styles.swatch,
                      {
                        borderColor: theme.palette.border,
                        backgroundColor: v.hex ?? theme.palette.surface,
                        opacity: v.inStock ? 1 : 0.4,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      theme.typography.micro,
                      { color: theme.palette.textMuted, marginTop: 4, textAlign: 'center' },
                    ]}
                  >
                    {v.value}
                  </Text>
                </AnimatedTouchable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {sizeVariants.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Pick a {sizeVariants[0].label.toLowerCase()}
              </Text>
              <AnimatedTouchable
                onPress={() => navigation.navigate('VariantSelection', { productId: product.id })}
                hapticKind="light"
              >
                <Text
                  style={[
                    theme.typography.captionStrong,
                    { color: theme.palette.primary },
                  ]}
                >
                  Size guide
                </Text>
              </AnimatedTouchable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingTop: 10 }}
            >
              {sizeVariants.map((v) => (
                <AnimatedTouchable
                  key={v.id}
                  onPress={() => navigation.navigate('VariantSelection', { productId: product.id })}
                  hapticKind="selection"
                  style={[
                    styles.sizeChip,
                    {
                      borderColor: theme.palette.border,
                      backgroundColor: theme.palette.surface,
                      opacity: v.inStock ? 1 : 0.4,
                    },
                  ]}
                >
                  <Text
                    style={[theme.typography.captionStrong, { color: theme.palette.text }]}
                  >
                    {v.value}
                  </Text>
                </AnimatedTouchable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <FilterChip
              label="Highlights"
              active={activeTab === 'highlights'}
              onPress={() => setActiveTab('highlights')}
              icon="sparkles"
            />
            <FilterChip
              label="Specs"
              active={activeTab === 'specs'}
              onPress={() => setActiveTab('specs')}
              icon="settings"
            />
            <FilterChip
              label="Shipping & Returns"
              active={activeTab === 'shipping'}
              onPress={() => setActiveTab('shipping')}
              icon="rocket"
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          {loadingExtras ? (
            <View>
              <Skeleton height={14} style={{ marginBottom: 8 }} />
              <Skeleton height={14} style={{ marginBottom: 8, width: '90%' }} />
              <Skeleton height={14} style={{ marginBottom: 8, width: '80%' }} />
            </View>
          ) : activeTab === 'highlights' ? (
            <GlassCard>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Why people love this
              </Text>
              <View style={{ marginTop: 8 }}>
                {product.highlights.map((h, i) => (
                  <View key={`${h}-${i}`} style={styles.bulletRow}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.palette.success} />
                    <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginLeft: 8, flex: 1 }]}>
                      {h}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 12 }]}>
                {product.longDescription}
              </Text>
            </GlassCard>
          ) : activeTab === 'specs' ? (
            <GlassCard>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Specifications
              </Text>
              <View style={{ marginTop: 10 }}>
                {product.specs.map((s, i) => (
                  <View key={`${s.key}-${i}`} style={styles.specRow}>
                    <Text style={[theme.typography.caption, { color: theme.palette.textMuted, flex: 1 }]}>
                      {s.key}
                    </Text>
                    <Text style={[theme.typography.captionStrong, { color: theme.palette.text, flex: 2 }]}>
                      {s.value}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          ) : (
            <GlassCard>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Shipping & Returns
              </Text>
              <View style={{ marginTop: 10, gap: 12 }}>
                <DetailItem
                  icon="rocket"
                  title="Delivery"
                  description={`Estimated delivery in ${product.deliveryEta}. Free shipping in metros over ₹999.`}
                />
                <DetailItem
                  icon="refresh"
                  title="Returns"
                  description={
                    product.returnable
                      ? '30-day no-questions returns. We pick up from your doorstep.'
                      : 'This item is final sale and cannot be returned.'
                  }
                />
                <DetailItem
                  icon="shield-checkmark"
                  title="Warranty"
                  description={`${product.warrantyMonths} months manufacturer warranty.`}
                />
                <DetailItem
                  icon="cube"
                  title="Stock"
                  description={
                    product.inStock
                      ? `${product.stockCount} units left in our warehouse.`
                      : 'Currently sold out — tap notify-me for restock alerts.'
                  }
                />
              </View>
            </GlassCard>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Customer love · {product.rating.toFixed(1)} ★
          </Text>
          <View style={{ marginTop: 10 }}>
            <RatingHistogram
              average={product.rating}
              total={product.reviewCount}
              data={ratingHistogram}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            {reviews.slice(0, 4).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </View>
          <AnimatedTouchable
            onPress={() => Toast.show({ type: 'info', text1: 'Loading all reviews…' })}
            hapticKind="light"
            style={[styles.allReviewsBtn, { borderColor: theme.palette.border }]}
          >
            <Text style={[theme.typography.captionStrong, { color: theme.palette.text }]}>
              See all {formatCompactNumber(product.reviewCount)} reviews
            </Text>
            <Ionicons name="chevron-forward" size={14} color={theme.palette.text} />
          </AnimatedTouchable>
        </View>

        <SectionHeader
          title="You might also love"
          subtitle="Hand-picked picks from the same aisle"
          icon="sparkles"
        />
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
              onPress={() => navigation.push('ProductDetail', { productId: p.id })}
            />
          ))}
        </ScrollView>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.palette.surface,
            borderColor: theme.palette.border,
          },
        ]}
      >
        <PrimaryButton
          title="Add to cart"
          variant="glass"
          iconLeft="bag-handle"
          onPress={handleAddToCart}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Buy now"
          variant="primary"
          iconLeft="flash"
          onPress={handleBuyNow}
          fullWidth={false}
          style={{ flex: 1, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const DetailItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={[
          styles.detailIcon,
          { backgroundColor: theme.palette.primarySoft },
        ]}
      >
        <Ionicons name={icon} size={16} color={theme.palette.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[theme.typography.captionStrong, { color: theme.palette.text }]}>
          {title}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const RatingHistogram: React.FC<{
  average: number;
  total: number;
  data: { count: number; percent: number }[];
}> = ({ average, total, data }) => {
  const theme = useTheme();
  return (
    <View style={[styles.histogramCard, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[theme.typography.display, { color: theme.palette.text, fontSize: 36 }]}>
          {average.toFixed(1)}
        </Text>
        <RatingStars rating={average} size={14} />
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
          based on {formatCompactNumber(total)} reviews
        </Text>
      </View>
      <View style={{ flex: 2, gap: 6 }}>
        {data
          .map((d, i) => ({ ...d, label: i + 1 }))
          .reverse()
          .map((d) => (
            <View key={d.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[theme.typography.caption, { color: theme.palette.textMuted, width: 20 }]}
              >
                {d.label}
              </Text>
              <View
                style={[
                  styles.barTrack,
                  { backgroundColor: theme.palette.surfaceHigh },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${d.percent}%`,
                      backgroundColor: theme.palette.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[theme.typography.caption, { color: theme.palette.textMuted, width: 36, textAlign: 'right' }]}
              >
                {d.percent}%
              </Text>
            </View>
          ))}
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
  galleryWrap: { width: SCREEN_W, height: SCREEN_W * 0.95, position: 'relative' },
  galleryImageWrap: { alignItems: 'center', justifyContent: 'center' },
  galleryImage: { width: '100%', height: '100%' },
  galleryDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  galleryDot: { height: 6, borderRadius: 3 },
  galleryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  info: { paddingHorizontal: 18, paddingTop: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skuPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  savingsPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  section: { paddingHorizontal: 16, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  sizeChip: {
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  specRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  histogramCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 18,
  },
  barTrack: {
    flex: 1,
    height: 6,
    marginHorizontal: 8,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  allReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
    gap: 6,
  },
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
