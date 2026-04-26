import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useHistory } from '../../store/HistoryContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useDebounce } from '../../hooks/useDebounce';

import { popularSearches, trendingTags } from '../../data/searchSeeds';
import { categories } from '../../data/categories';
import { products } from '../../data/products';

import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SearchInput } from '../../components/SearchInput';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCard } from '../../components/ProductCard';
import { GlassCard } from '../../components/GlassCard';
import { SectionHeader } from '../../components/SectionHeader';

import { productMatchesQuery } from '../../utils/helpers';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchMain'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { recentSearches, pushSearch, clearSearches } = useHistory();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 220);

  const livePreview = React.useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return products.filter((p) => productMatchesQuery(p, debouncedQuery)).slice(0, 6);
  }, [debouncedQuery]);

  const submit = useCallback(
    (q: string) => {
      const text = q.trim();
      if (!text) return;
      pushSearch(text);
      haptic('selection');
      navigation.navigate('SearchResults', { query: text });
    },
    [haptic, navigation, pushSearch]
  );

  return (
    <ScreenContainer scroll edges={['top']} contentStyle={{ paddingBottom: 140 }}>
      <ScreenHeader title="Discover" subtitle="Search 100k+ products in milliseconds" showBack={false} />
      <View style={{ paddingHorizontal: 16, paddingTop: 4 }}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Try ‘running shoes under 5000’"
          onSubmit={() => submit(query)}
          onPressFilter={() => navigation.navigate('SearchFilter', { query })}
          autoFocus={false}
        />
      </View>

      {livePreview.length > 0 ? (
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>
            Live results
          </Text>
          <GlassCard style={{ marginTop: 8 }}>
            {livePreview.map((p) => (
              <AnimatedTouchable
                key={p.id}
                onPress={() => navigation.navigate('SearchProductDetail', { productId: p.id })}
                hapticKind="light"
                style={[styles.previewRow, { borderColor: theme.palette.divider }]}
              >
                <View style={[styles.previewIcon, { backgroundColor: theme.palette.primarySoft }]}>
                  <Ionicons name="search" size={14} color={theme.palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]} numberOfLines={1}>
                    {p.brand}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={theme.palette.textMuted} />
              </AnimatedTouchable>
            ))}
          </GlassCard>
        </View>
      ) : null}

      {recentSearches.length > 0 ? (
        <>
          <SectionHeader
            title="Your recent searches"
            actionLabel="Clear"
            onActionPress={clearSearches}
            icon="time"
          />
          <View style={styles.chipRow}>
            {recentSearches.slice(0, 12).map((q) => (
              <AnimatedTouchable
                key={q}
                onPress={() => submit(q)}
                hapticKind="selection"
                style={[styles.chip, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}
              >
                <Ionicons name="time-outline" size={14} color={theme.palette.textMuted} />
                <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginLeft: 6 }]}>
                  {q}
                </Text>
              </AnimatedTouchable>
            ))}
          </View>
        </>
      ) : null}

      <SectionHeader title="Popular this week" subtitle="What people are searching for" icon="flame" />
      <View style={styles.chipRow}>
        {popularSearches.slice(0, 16).map((q) => (
          <AnimatedTouchable
            key={q}
            onPress={() => submit(q)}
            hapticKind="selection"
            style={[styles.chip, { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border }]}
          >
            <Ionicons name="trending-up" size={14} color={theme.palette.accent} />
            <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginLeft: 6 }]}>
              {q}
            </Text>
          </AnimatedTouchable>
        ))}
      </View>

      <SectionHeader title="Trending tags" icon="pricetags" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {trendingTags.map((t, idx) => (
          <AnimatedTouchable
            key={t}
            onPress={() => submit(t.replace('-', ' '))}
            hapticKind="selection"
          >
            <LinearGradient
              colors={categories[idx % categories.length].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tagPill}
            >
              <Text style={[theme.typography.captionStrong, { color: '#FFFFFF' }]}>
                #{t}
              </Text>
            </LinearGradient>
          </AnimatedTouchable>
        ))}
      </ScrollView>

      <SectionHeader title="Browse all categories" icon="grid" />
      <View style={styles.gridWrap}>
        {categories.map((c) => (
          <View key={c.id} style={{ marginRight: 12, marginBottom: 12 }}>
            <CategoryCard
              category={c}
              size="md"
              onPress={() => submit(c.name)}
            />
          </View>
        ))}
      </View>

      <SectionHeader title="Quick picks" icon="sparkles" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {products.slice(0, 8).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            variant="horizontal"
            onPress={() => navigation.navigate('SearchProductDetail', { productId: p.id })}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  previewIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
});
