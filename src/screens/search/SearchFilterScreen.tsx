import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

import { brands } from '../../data/brands';
import { categories } from '../../data/categories';

import { ScreenHeader } from '../../components/ScreenHeader';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FilterChip } from '../../components/FilterChip';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchFilter'>;

export const SearchFilterScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const [priceMin, setPriceMin] = useState(199);
  const [priceMax, setPriceMax] = useState(29999);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price-asc' | 'price-desc' | 'newest'>('relevance');

  const toggleBrand = (id: string) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const applyDisabled = useMemo(() => priceMin > priceMax, [priceMin, priceMax]);

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Filters" subtitle={`Refine results for "${route.params.query}"`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <GlassCard>
          <SectionTitle title="Sort by" icon="swap-vertical" />
          <View style={styles.chipWrap}>
            <FilterChip label="Relevance" active={sortBy === 'relevance'} onPress={() => setSortBy('relevance')} icon="sparkles" />
            <FilterChip label="Rating" active={sortBy === 'rating'} onPress={() => setSortBy('rating')} icon="star" />
            <FilterChip label="Price ↑" active={sortBy === 'price-asc'} onPress={() => setSortBy('price-asc')} icon="arrow-up" />
            <FilterChip label="Price ↓" active={sortBy === 'price-desc'} onPress={() => setSortBy('price-desc')} icon="arrow-down" />
            <FilterChip label="Newest" active={sortBy === 'newest'} onPress={() => setSortBy('newest')} icon="time" />
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <SectionTitle title="Price" icon="pricetag" />
          <View style={styles.priceRow}>
            <View style={[styles.priceBox, { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border }]}>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>Min</Text>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                {formatMoney({ amount: priceMin, currency: 'INR' })}
              </Text>
            </View>
            <View style={[styles.priceBox, { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border }]}>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>Max</Text>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                {formatMoney({ amount: priceMax, currency: 'INR' })}
              </Text>
            </View>
          </View>
          <View style={styles.priceQuickRow}>
            {[
              [199, 999],
              [999, 4999],
              [4999, 14999],
              [14999, 49999],
            ].map(([lo, hi]) => (
              <AnimatedTouchable
                key={`${lo}-${hi}`}
                hapticKind="selection"
                onPress={() => {
                  setPriceMin(lo);
                  setPriceMax(hi);
                }}
                style={[
                  styles.priceChip,
                  {
                    backgroundColor:
                      priceMin === lo && priceMax === hi
                        ? theme.palette.primary
                        : theme.palette.surface,
                    borderColor: theme.palette.border,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.captionStrong,
                    {
                      color:
                        priceMin === lo && priceMax === hi
                          ? theme.palette.onPrimary
                          : theme.palette.text,
                    },
                  ]}
                >
                  ₹{lo.toLocaleString('en-IN')}–₹{hi.toLocaleString('en-IN')}
                </Text>
              </AnimatedTouchable>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <SectionTitle title="Rating" icon="star" />
          <View style={styles.chipWrap}>
            {[0, 3, 4, 4.5].map((r) => (
              <FilterChip
                key={r}
                label={r === 0 ? 'Any' : `${r}★ & up`}
                active={minRating === r}
                onPress={() => setMinRating(r)}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <SectionTitle title="Brands" icon="ribbon" />
          <View style={styles.chipWrap}>
            {brands.slice(0, 14).map((b) => (
              <FilterChip
                key={b.id}
                label={b.name}
                active={selectedBrands.includes(b.id)}
                onPress={() => toggleBrand(b.id)}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <SectionTitle title="Categories" icon="grid" />
          <View style={styles.chipWrap}>
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                label={`${c.emoji} ${c.name}`}
                active={selectedCategories.includes(c.id)}
                onPress={() => toggleCategory(c.id)}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <SectionTitle title="Other" icon="options" />
          <ToggleRow label="In stock only" value={inStockOnly} onChange={setInStockOnly} />
          <ToggleRow label="Free shipping" value={freeShippingOnly} onChange={setFreeShippingOnly} />
        </GlassCard>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <PrimaryButton
          title="Reset"
          variant="glass"
          onPress={() => {
            setPriceMin(199);
            setPriceMax(29999);
            setSelectedBrands([]);
            setSelectedCategories([]);
            setMinRating(0);
            setInStockOnly(true);
            setFreeShippingOnly(false);
            setSortBy('relevance');
          }}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Apply filters"
          variant="primary"
          iconRight="arrow-forward"
          disabled={applyDisabled}
          onPress={() => navigation.goBack()}
          fullWidth={false}
          style={{ flex: 1.4, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const SectionTitle: React.FC<{ title: string; icon: keyof typeof Ionicons.glyphMap }> = ({
  title,
  icon,
}) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon} size={16} color={theme.palette.primary} />
      <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>{title}</Text>
    </View>
  );
};

const ToggleRow: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({
  label,
  value,
  onChange,
}) => {
  const theme = useTheme();
  return (
    <AnimatedTouchable onPress={() => onChange(!value)} hapticKind="selection" style={styles.toggleRow}>
      <Text style={[theme.typography.body, { color: theme.palette.text, flex: 1 }]}>{label}</Text>
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: value ? theme.palette.primary : theme.palette.surfaceHigh,
            borderColor: value ? theme.palette.primary : theme.palette.border,
          },
        ]}
      >
        <View
          style={[
            styles.toggleKnob,
            {
              backgroundColor: '#fff',
              transform: [{ translateX: value ? 18 : 0 }],
            },
          ]}
        />
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  priceRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  priceBox: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 },
  priceQuickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  priceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  toggle: { width: 44, height: 26, borderRadius: 13, padding: 2, justifyContent: 'center', borderWidth: 1 },
  toggleKnob: { width: 20, height: 20, borderRadius: 10 },
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
