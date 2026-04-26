import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CartStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findProduct } from '../../data/products';

import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { QuantitySelector } from '../../components/QuantitySelector';
import { FilterChip } from '../../components/FilterChip';
import { SectionHeader } from '../../components/SectionHeader';
import { formatMoney } from '../../utils/format';
import { multiplyMoney, sumMoney, sleep } from '../../utils/helpers';

type Tab = 'cart' | 'saved' | 'wishlist';

type Props = NativeStackScreenProps<CartStackParamList, 'CartMain'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { items, updateQuantity, remove, subtotal, count } = useCart();
  const { entries: wishlist, remove: removeFromWishlist, toggle } = useWishlist();
  const [tab, setTab] = useState<Tab>('cart');
  const [savedForLater, setSavedForLater] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptic('medium');
    await sleep(700);
    setRefreshing(false);
  }, [haptic]);

  const itemRows = useMemo(
    () =>
      items
        .map((it) => {
          const p = findProduct(it.productId);
          return p ? { ...it, product: p } : null;
        })
        .filter(Boolean) as ({ product: NonNullable<ReturnType<typeof findProduct>> } & (typeof items)[number])[],
    [items]
  );

  const taxes = useMemo(
    () => ({ amount: Math.round(subtotal.amount * 0.05), currency: subtotal.currency }),
    [subtotal]
  );
  const shipping = useMemo(
    () => ({ amount: subtotal.amount > 999 ? 0 : 49, currency: subtotal.currency }),
    [subtotal]
  );
  const total = useMemo(() => sumMoney([subtotal, taxes, shipping]), [subtotal, taxes, shipping]);

  const wishlistProducts = useMemo(
    () =>
      wishlist
        .map((w) => findProduct(w.productId))
        .filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[],
    [wishlist]
  );

  return (
    <ScreenContainer
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentStyle={{ paddingBottom: 220 }}
    >
      <ScreenHeader
        title="Your bag"
        subtitle={`${count} item${count === 1 ? '' : 's'} in cart`}
        showBack={false}
      />

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
        <FilterChip label={`Cart (${count})`} active={tab === 'cart'} onPress={() => setTab('cart')} icon="bag-handle" />
        <FilterChip label={`Saved (${savedForLater.length})`} active={tab === 'saved'} onPress={() => setTab('saved')} icon="bookmark" />
        <FilterChip label={`Wishlist (${wishlist.length})`} active={tab === 'wishlist'} onPress={() => setTab('wishlist')} icon="heart" />
      </View>

      {tab === 'cart' ? (
        count === 0 ? (
          <EmptyState
            emoji="🛍️"
            title="Cart is feeling lonely"
            description="Browse our handpicked collections and start filling it up."
            ctaLabel="Continue shopping"
            onPressCTA={() => navigation.popToTop()}
          />
        ) : (
          <View style={{ paddingTop: 12 }}>
            <View style={{ paddingHorizontal: 16 }}>
              <LinearGradient
                colors={theme.palette.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.coupon}
              >
                <Ionicons name="ribbon" size={16} color={theme.palette.onPrimary} />
                <Text style={[theme.typography.captionStrong, { color: theme.palette.onPrimary, marginLeft: 8, flex: 1 }]}>
                  Apply code WELCOME15 for 15% off your first order
                </Text>
                <AnimatedTouchable
                  hapticKind="light"
                  onPress={() => haptic('selection')}
                  style={[styles.couponBtn]}
                >
                  <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>Apply</Text>
                </AnimatedTouchable>
              </LinearGradient>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              {itemRows.map((row) => (
                <View
                  key={row.id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
                  ]}
                >
                  <AnimatedTouchable
                    onPress={() => navigation.navigate('CartItemEdit', { itemId: row.id })}
                    hapticKind="light"
                    style={{ flexDirection: 'row' }}
                  >
                    <Image source={{ uri: row.product.thumbnail }} style={styles.itemImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
                        {row.product.brand.toUpperCase()}
                      </Text>
                      <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 2 }]} numberOfLines={2}>
                        {row.product.title}
                      </Text>
                      <Text style={[theme.typography.h4, { color: theme.palette.text, marginTop: 6 }]}>
                        {formatMoney(multiplyMoney(row.unitPrice, row.quantity))}
                      </Text>
                    </View>
                  </AnimatedTouchable>
                  <View style={[styles.itemActions, { borderColor: theme.palette.divider }]}>
                    <QuantitySelector
                      value={row.quantity}
                      onChange={(q) => updateQuantity(row.id, q)}
                      size="sm"
                    />
                    <View style={{ flex: 1 }} />
                    <AnimatedTouchable
                      hapticKind="selection"
                      onPress={() => {
                        setSavedForLater((s) => [...s, row.productId]);
                        remove(row.id);
                      }}
                      style={styles.actionBtn}
                    >
                      <Ionicons name="bookmark-outline" size={14} color={theme.palette.primary} />
                      <Text style={[theme.typography.captionStrong, { color: theme.palette.primary, marginLeft: 6 }]}>
                        Save
                      </Text>
                    </AnimatedTouchable>
                    <AnimatedTouchable
                      hapticKind="warning"
                      onPress={() => remove(row.id)}
                      style={styles.actionBtn}
                    >
                      <Ionicons name="trash-outline" size={14} color={theme.palette.danger} />
                      <Text style={[theme.typography.captionStrong, { color: theme.palette.danger, marginLeft: 6 }]}>
                        Remove
                      </Text>
                    </AnimatedTouchable>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <GlassCard>
                <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                  Order summary
                </Text>
                <SummaryRow label={`Subtotal · ${count} items`} value={formatMoney(subtotal)} />
                <SummaryRow label="Taxes (incl.)" value={formatMoney(taxes)} />
                <SummaryRow label="Shipping" value={shipping.amount === 0 ? 'Free' : formatMoney(shipping)} />
                <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
                <SummaryRow label="Estimated total" value={formatMoney(total)} bold />
              </GlassCard>
            </View>
          </View>
        )
      ) : null}

      {tab === 'saved' ? (
        savedForLater.length === 0 ? (
          <EmptyState
            emoji="🔖"
            title="Nothing saved yet"
            description="Long-press any cart item to save it for later."
          />
        ) : (
          <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
            {savedForLater.map((pid) => {
              const p = findProduct(pid);
              if (!p) return null;
              return (
                <View
                  key={pid}
                  style={[
                    styles.itemCard,
                    { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
                  ]}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: p.thumbnail }} style={styles.itemImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>{p.title}</Text>
                      <Text style={[theme.typography.h4, { color: theme.palette.text, marginTop: 6 }]}>
                        {formatMoney(p.price)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.itemActions, { borderColor: theme.palette.divider }]}>
                    <PrimaryButton
                      title="Move to cart"
                      iconLeft="bag-handle"
                      variant="primary"
                      size="sm"
                      onPress={() =>
                        setSavedForLater((s) => s.filter((id) => id !== pid))
                      }
                      fullWidth={false}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )
      ) : null}

      {tab === 'wishlist' ? (
        wishlistProducts.length === 0 ? (
          <EmptyState
            emoji="💗"
            title="No favorites yet"
            description="Tap the heart on any product card to keep it in your wishlist."
          />
        ) : (
          <>
            <SectionHeader title="Your wishlist" subtitle="Tap a card to view, or move to cart" icon="heart" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {wishlistProducts.map((p) => (
                <View key={p.id} style={{ width: 220 }}>
                  <ProductCard
                    product={p}
                    variant="horizontal"
                    onPress={() => toggle(p.id)}
                    onPressWishlist={() => removeFromWishlist(p.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )
      ) : null}

      {tab === 'cart' && itemRows.length > 0 ? (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <PrimaryButton
            title="Proceed to address"
            iconRight="arrow-forward"
            variant="primary"
            onPress={() => navigation.navigate('AddressSelection')}
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => {
  const theme = useTheme();
  return (
    <View style={styles.summaryRow}>
      <Text
        style={[
          bold ? theme.typography.bodyStrong : theme.typography.body,
          { color: bold ? theme.palette.text : theme.palette.textSecondary },
        ]}
      >
        {label}
      </Text>
      <Text style={[bold ? theme.typography.h3 : theme.typography.bodyStrong, { color: theme.palette.text }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  couponBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFFEE',
  },
  itemCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemImage: { width: 90, height: 90, borderRadius: 14 },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 6 },
});
