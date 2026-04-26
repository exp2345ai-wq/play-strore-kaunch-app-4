import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

import { products } from '../../data/products';
import { popularSearches } from '../../data/searchSeeds';

import { SearchInput } from '../../components/SearchInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { FilterChip } from '../../components/FilterChip';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { EmptyState } from '../../components/EmptyState';
import { GlassCard } from '../../components/GlassCard';

import { productMatchesQuery } from '../../utils/helpers';

const { width: SCREEN_W } = Dimensions.get('window');
const COLUMN_W = (SCREEN_W - 16 * 2 - 12) / 2;

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResults'>;

export const SearchResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const initial = route.params.query;
  const [query, setQuery] = useState(initial);
  const [activeFilter, setActiveFilter] = useState<'all' | 'under-1k' | 'under-5k' | 'free-shipping' | 'top-rated'>('all');

  const filtered = useMemo(() => {
    let list = products.filter((p) => productMatchesQuery(p, query));
    switch (activeFilter) {
      case 'under-1k':
        list = list.filter((p) => p.price.amount <= 1000);
        break;
      case 'under-5k':
        list = list.filter((p) => p.price.amount <= 5000);
        break;
      case 'free-shipping':
        list = list.filter((p) => p.freeShipping);
        break;
      case 'top-rated':
        list = list.filter((p) => p.rating >= 4.5);
        break;
    }
    return list;
  }, [query, activeFilter]);

  const { items, loading, refresh, refreshing, loadMore, hasMore } = useInfiniteScroll(filtered, 10);

  const onRefresh = useCallback(async () => {
    haptic('medium');
    await refresh();
  }, [haptic, refresh]);

  useEffect(() => {
    refresh();
  }, [filtered.length, refresh]);

  const suggestions = useMemo(
    () => popularSearches.filter((p) => p.toLowerCase() !== query.toLowerCase()).slice(0, 6),
    [query]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Results" subtitle={`${filtered.length} matches for "${query}"`} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onSubmit={() => {}}
          onPressFilter={() => navigation.navigate('SearchFilter', { query })}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
        style={{ flexGrow: 0 }}
      >
        <FilterChip
          label="All"
          active={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
          icon="apps"
        />
        <FilterChip
          label="Under ₹1k"
          active={activeFilter === 'under-1k'}
          onPress={() => setActiveFilter('under-1k')}
        />
        <FilterChip
          label="Under ₹5k"
          active={activeFilter === 'under-5k'}
          onPress={() => setActiveFilter('under-5k')}
        />
        <FilterChip
          label="Free shipping"
          active={activeFilter === 'free-shipping'}
          onPress={() => setActiveFilter('free-shipping')}
          icon="rocket"
        />
        <FilterChip
          label="4.5★ & up"
          active={activeFilter === 'top-rated'}
          onPress={() => setActiveFilter('top-rated')}
          icon="star"
        />
      </ScrollView>

      {filtered.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <EmptyState
            emoji="🪐"
            title="Nothing here"
            description={`We couldn't find anything for "${query}". Try a related term below.`}
          />
          <GlassCard style={{ marginTop: 8 }}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Try one of these
            </Text>
            <View style={styles.suggestionWrap}>
              {suggestions.map((s) => (
                <AnimatedTouchable
                  key={s}
                  onPress={() => setQuery(s)}
                  hapticKind="selection"
                  style={[
                    styles.chip,
                    { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border },
                  ]}
                >
                  <Ionicons name="bulb" size={12} color={theme.palette.warning} />
                  <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginLeft: 6 }]}>
                    {s}
                  </Text>
                </AnimatedTouchable>
              ))}
            </View>
          </GlassCard>
        </ScrollView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 12, paddingTop: 4, paddingBottom: 200 }}
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
            <View style={{ width: COLUMN_W }}>
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('SearchProductDetail', { productId: item.id })
                }
              />
            </View>
          )}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>
                Did you mean?
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingTop: 8 }}
              >
                {suggestions.slice(0, 5).map((s) => (
                  <AnimatedTouchable
                    key={s}
                    onPress={() =>
                      navigation.push('SearchSuggestionResults', {
                        suggestionId: s,
                        query: s,
                      })
                    }
                    hapticKind="selection"
                    style={[
                      styles.chip,
                      { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
                    ]}
                  >
                    <Ionicons name="sparkles" size={12} color={theme.palette.primary} />
                    <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginLeft: 6 }]}>
                      {s}
                    </Text>
                  </AnimatedTouchable>
                ))}
              </ScrollView>
            </View>
          }
          ListFooterComponent={
            loading ? (
              <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 8 }}>
                <View style={{ width: COLUMN_W }}>
                  <ProductCardSkeleton />
                </View>
                <View style={{ width: COLUMN_W }}>
                  <ProductCardSkeleton />
                </View>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  suggestionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
});
