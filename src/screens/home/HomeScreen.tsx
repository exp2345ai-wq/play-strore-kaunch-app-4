import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeStackParamList } from '../../types';
import { useTheme, useThemeControl } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';

import { categories } from '../../data/categories';
import { banners } from '../../data/banners';
import {
  bestsellers,
  featuredProducts,
  newArrivals,
  trendingProducts,
} from '../../data/products';

import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CategoryCard } from '../../components/CategoryCard';
import { GlassCard } from '../../components/GlassCard';
import { IconButton } from '../../components/IconButton';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { SectionHeader } from '../../components/SectionHeader';
import { useHaptics } from '../../hooks/useHaptics';
import { sleep } from '../../utils/helpers';
import { formatCompactNumber, formatMoney } from '../../utils/format';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_GUTTER = 12;
const GRID_PADDING = 16;
const GRID_COLUMN_W = (SCREEN_W - GRID_PADDING * 2 - GRID_GUTTER) / 2;

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { toggle, colorMode } = useThemeControl();
  const { count } = useCart();
  const { entries: wishlistEntries } = useWishlist();
  const haptic = useHaptics();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptic('medium');
    await sleep(900);
    setRefreshing(false);
  }, [haptic]);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const trending = useMemo(() => trendingProducts(), []);
  const featured = useMemo(() => featuredProducts(), []);
  const newest = useMemo(() => newArrivals(), []);
  const bests = useMemo(() => bestsellers(), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <LinearGradient
        colors={theme.palette.gradientCardSoft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.palette.primary}
              colors={[theme.palette.primary, theme.palette.accent]}
            />
          }
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>
                Welcome back, Aanya 👋
              </Text>
              <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 2 }]}>
                Discover something delightful
              </Text>
            </View>
            <IconButton
              icon={colorMode === 'dark' ? 'sunny' : 'moon'}
              variant="glass"
              onPress={toggle}
              accessibilityLabel="Toggle theme"
              hapticKind="selection"
            />
            <IconButton
              icon="notifications-outline"
              variant="glass"
              onPress={() => navigation.navigate('CategoryProducts', { categoryId: categories[0].id })}
              accessibilityLabel="Notifications"
            />
          </View>

          <GlassCard style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>
                  Saved this month
                </Text>
                <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 2 }]}>
                  ₹3,840
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.palette.divider }]} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>
                  Cart
                </Text>
                <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 2 }]}>
                  {count}
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.palette.divider }]} />
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>
                  Wishlist
                </Text>
                <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 2 }]}>
                  {wishlistEntries.length}
                </Text>
              </View>
            </View>
          </GlassCard>

          <BannerCarousel
            banners={banners.slice(0, 6)}
            onPressBanner={(b) => {
              if (b.targetCategoryId) {
                navigation.navigate('CategoryProducts', { categoryId: b.targetCategoryId });
              }
            }}
          />

          <SectionHeader
            title="Shop by category"
            subtitle="From streetwear to gourmet — pick your aisle."
            actionLabel="See all"
            icon="grid"
            onActionPress={() =>
              navigation.navigate('CategoryProducts', { categoryId: categories[0].id })
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: c.id })}
              />
            ))}
          </ScrollView>

          <DealsRibbon onPress={() => navigation.navigate('CategoryProducts', { categoryId: categories[1].id })} />

          <SectionHeader
            title="Trending right now"
            subtitle="What people are obsessing over this week"
            actionLabel="See all"
            icon="flame"
            onActionPress={() =>
              navigation.navigate('CategoryProducts', { categoryId: categories[0].id })
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={{ width: 220 }}>
                    <ProductCardSkeleton />
                  </View>
                ))
              : trending.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="horizontal"
                    onPress={() =>
                      navigation.navigate('ProductDetail', { productId: p.id })
                    }
                  />
                ))}
          </ScrollView>

          <SectionHeader
            title="Featured edits"
            subtitle="Hand-curated by our editors"
            actionLabel="Explore"
            icon="star"
            onActionPress={() =>
              navigation.navigate('CategoryProducts', { categoryId: categories[2].id })
            }
          />

          <FlatList
            data={featured.slice(0, 8)}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GUTTER, paddingHorizontal: GRID_PADDING }}
            contentContainerStyle={{ gap: GRID_GUTTER }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ width: GRID_COLUMN_W }}>
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                />
              </View>
            )}
          />

          <SectionHeader
            title="Just dropped"
            subtitle="Fresh arrivals you saw here first"
            actionLabel="See more"
            icon="sparkles"
            onActionPress={() =>
              navigation.navigate('CategoryProducts', { categoryId: categories[3].id })
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {newest.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant="horizontal"
                onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
              />
            ))}
          </ScrollView>

          <SectionHeader
            title="Bestsellers"
            subtitle="Loved by 100k+ ShopX members"
            actionLabel="See all"
            icon="trophy"
            onActionPress={() =>
              navigation.navigate('CategoryProducts', { categoryId: categories[4].id })
            }
          />

          <FlatList
            data={bests.slice(0, 6)}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={{ gap: GRID_GUTTER, paddingHorizontal: GRID_PADDING }}
            contentContainerStyle={{ gap: GRID_GUTTER }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ width: GRID_COLUMN_W }}>
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                />
              </View>
            )}
          />

          <SectionHeader title="Inspiration" subtitle="Looks, lists & lookbooks" icon="albums" />

          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {categories.slice(0, 3).map((c) => (
              <AnimatedTouchable
                key={c.id}
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: c.id })}
                hapticKind="light"
                style={[
                  styles.inspirationCard,
                  { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
                ]}
              >
                <Image source={{ uri: c.bannerImage }} style={styles.inspirationImage} />
                <LinearGradient
                  colors={['#00000000', '#000000CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.inspirationContent}>
                  <Text style={[theme.typography.captionStrong, { color: '#FFFFFFCC' }]}>
                    {c.emoji} {c.name.toUpperCase()}
                  </Text>
                  <Text style={[theme.typography.h2, { color: '#FFFFFF', marginTop: 6 }]}>
                    {c.tagline}
                  </Text>
                  <View style={styles.inspirationMeta}>
                    <Text style={[theme.typography.caption, { color: '#FFFFFFCC' }]}>
                      {formatCompactNumber(c.productCount)} items · avg. {formatMoney(c.averagePrice)}
                    </Text>
                  </View>
                </View>
              </AnimatedTouchable>
            ))}
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Text
              style={[
                theme.typography.captionStrong,
                { color: theme.palette.textMuted, textAlign: 'center' },
              ]}
            >
              You've reached the bottom — but the catalogue keeps going.
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.palette.textMuted, textAlign: 'center', marginTop: 4 },
              ]}
            >
              Pull down to refresh or open a category to keep exploring.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const DealsRibbon: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
      <AnimatedTouchable onPress={onPress} hapticKind="light">
        <LinearGradient
          colors={theme.palette.gradientAurora}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={ribbon.wrap}
        >
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.captionStrong, { color: '#FFFFFFCC' }]}>
              FLASH MEGA DEALS · ENDS IN 02H 14M
            </Text>
            <Text style={[theme.typography.h3, { color: '#FFFFFF', marginTop: 4 }]}>
              Up to 80% off — limited drops, fast checkout
            </Text>
          </View>
          <View style={ribbon.cta}>
            <Ionicons name="arrow-forward" size={18} color="#0B0F1A" />
          </View>
        </LinearGradient>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
  },
  inspirationCard: {
    height: 180,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inspirationImage: { width: '100%', height: '100%' },
  inspirationContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  inspirationMeta: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
});

const ribbon = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    gap: 12,
  },
  cta: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
