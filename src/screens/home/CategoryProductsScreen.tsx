import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

import { findCategory } from '../../data/categories';
import { productsByCategory, productsBySubcategory } from '../../data/products';

import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { FilterChip } from '../../components/FilterChip';
import { EmptyState } from '../../components/EmptyState';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { QuickActionSheet, QuickActionSheetHandle } from '../../components/QuickActionSheet';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_GUTTER = 12;
const GRID_PADDING = 16;
const GRID_COLUMN_W = (SCREEN_W - GRID_PADDING * 2 - GRID_GUTTER) / 2;

type Props = NativeStackScreenProps<HomeStackParamList, 'CategoryProducts'>;

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortOptions: { id: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'relevance', label: 'Relevance', icon: 'sparkles' },
  { id: 'price-asc', label: 'Price ↑', icon: 'arrow-up' },
  { id: 'price-desc', label: 'Price ↓', icon: 'arrow-down' },
  { id: 'rating', label: 'Rating', icon: 'star' },
  { id: 'newest', label: 'Newest', icon: 'time' },
];

export const CategoryProductsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const sheetRef = useRef<QuickActionSheetHandle>(null);
  const [activeSub, setActiveSub] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('relevance');

  const category = findCategory(route.params.categoryId);
  const baseProducts = useMemo(() => {
    if (!category) return [];
    if (activeSub === 'all') return productsByCategory(category.id);
    return productsBySubcategory(activeSub);
  }, [category, activeSub]);

  const sortedProducts = useMemo(() => {
    const list = [...baseProducts];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price.amount - b.price.amount);
      case 'price-desc':
        return list.sort((a, b) => b.price.amount - a.price.amount);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return list;
    }
  }, [baseProducts, sort]);

  const { items, loading, refresh, refreshing, loadMore, hasMore } = useInfiniteScroll(
    sortedProducts,
    10
  );

  const onRefresh = useCallback(async () => {
    haptic('medium');
    await refresh();
  }, [refresh, haptic]);

  if (!category) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Category" />
        <EmptyState
          emoji="🤷"
          title="Category not found"
          description="The category you tried to open is missing from the catalogue."
        />
      </ScreenContainer>
    );
  }

  const totalCount = sortedProducts.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <LinearGradient
        colors={category.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { opacity: theme.mode === 'dark' ? 0.3 : 0.18 }]}
      />

      <ScreenContainer
        scroll={false}
        edges={['top']}
        contentStyle={{ flex: 1, paddingBottom: 0 }}
      >
        <ScreenHeader
          title={category.name}
          subtitle={`${totalCount} items · ${category.tagline}`}
          rightSlot={
            <>
              <AnimatedTouchable
                onPress={() => sheetRef.current?.open()}
                hapticKind="selection"
                style={[styles.headerBtn, { borderColor: theme.palette.border }]}
              >
                <Ionicons name="filter" size={16} color={theme.palette.text} />
              </AnimatedTouchable>
            </>
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 6 }}
          style={{ flexGrow: 0 }}
        >
          <FilterChip
            label="All"
            active={activeSub === 'all'}
            onPress={() => setActiveSub('all')}
            icon="apps"
          />
          {category.subcategories.map((s) => (
            <FilterChip
              key={s.id}
              label={s.name}
              active={activeSub === s.id}
              onPress={() => setActiveSub(s.id)}
              count={s.productCount}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 12 }}
          style={{ flexGrow: 0 }}
        >
          {sortOptions.map((s) => (
            <FilterChip
              key={s.id}
              label={s.label}
              active={sort === s.id}
              onPress={() => setSort(s.id)}
              icon={s.icon}
            />
          ))}
        </ScrollView>

        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_GUTTER, paddingHorizontal: GRID_PADDING }}
          contentContainerStyle={{ gap: GRID_GUTTER, paddingTop: 18, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.palette.primary}
              colors={[theme.palette.primary, theme.palette.accent]}
            />
          }
          renderItem={({ item }) => (
            <View style={{ width: GRID_COLUMN_W }}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              />
            </View>
          )}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? (
              <View style={{ flexDirection: 'row', gap: GRID_GUTTER, paddingHorizontal: GRID_PADDING }}>
                <View style={{ width: GRID_COLUMN_W }}>
                  <ProductCardSkeleton />
                </View>
                <View style={{ width: GRID_COLUMN_W }}>
                  <ProductCardSkeleton />
                </View>
              </View>
            ) : !hasMore ? (
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.palette.textMuted, textAlign: 'center', padding: 24 },
                ]}
              >
                That's the entire {category.name.toLowerCase()} aisle. Try another sort or sub-category!
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                emoji="🪐"
                title="Nothing matches"
                description="Try a different filter or sub-category."
              />
            ) : null
          }
        />
      </ScreenContainer>

      <QuickActionSheet
        ref={sheetRef}
        title="Refine"
        description="Quick toggles. Tap an option to apply instantly."
        actions={[
          {
            key: 'rating',
            label: 'Sort by rating',
            icon: 'star',
            onPress: () => setSort('rating'),
          },
          {
            key: 'price-asc',
            label: 'Lowest price first',
            icon: 'arrow-up',
            onPress: () => setSort('price-asc'),
          },
          {
            key: 'price-desc',
            label: 'Highest price first',
            icon: 'arrow-down',
            onPress: () => setSort('price-desc'),
          },
          {
            key: 'newest',
            label: 'Newest first',
            icon: 'time',
            onPress: () => setSort('newest'),
          },
          {
            key: 'reset',
            label: 'Reset filters',
            icon: 'refresh',
            tint: 'warning',
            onPress: () => {
              setSort('relevance');
              setActiveSub('all');
            },
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { position: 'absolute', left: 0, right: 0, top: 0, height: 220 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
