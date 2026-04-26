import React, { useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SearchStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

import { products } from '../../data/products';

import { ScreenHeader } from '../../components/ScreenHeader';
import { ProductCard } from '../../components/ProductCard';
import { GlassCard } from '../../components/GlassCard';
import { productMatchesQuery } from '../../utils/helpers';

const { width: SCREEN_W } = Dimensions.get('window');
const COLUMN_W = (SCREEN_W - 16 * 2 - 12) / 2;

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchSuggestionResults'>;

export const SearchSuggestionResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { query } = route.params;

  const matches = useMemo(
    () => products.filter((p) => productMatchesQuery(p, query)).slice(0, 50),
    [query]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Suggestion" subtitle={`Matches for "${query}"`} />
      <FlatList
        data={matches}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View style={{ width: COLUMN_W }}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('SearchProductDetail', { productId: item.id })}
            />
          </View>
        )}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <LinearGradient
              colors={theme.palette.gradientAurora}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <Ionicons name="sparkles" size={20} color="#FFF" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[theme.typography.captionStrong, { color: '#FFFFFFCC' }]}>
                  AI suggestion
                </Text>
                <Text style={[theme.typography.subtitle, { color: '#FFFFFF', marginTop: 2 }]}>
                  Curated picks for "{query}"
                </Text>
              </View>
            </LinearGradient>
            <GlassCard style={{ marginTop: 12 }}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Why we suggest this
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 6 }]}>
                Based on the most-loved items, current trends, and what shoppers like you bought
                this week. Tap any card for the full breakdown.
              </Text>
            </GlassCard>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
  },
});
