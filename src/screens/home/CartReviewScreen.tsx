import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { HomeStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';

import { findProduct } from '../../data/products';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { QuantitySelector } from '../../components/QuantitySelector';
import { EmptyState } from '../../components/EmptyState';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

import { formatMoney } from '../../utils/format';
import { multiplyMoney, sumMoney } from '../../utils/helpers';

type Props = NativeStackScreenProps<HomeStackParamList, 'CartReview'>;

export const CartReviewScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const { items, updateQuantity, remove, subtotal, count } = useCart();
  const rootNav = useNavigation();

  const itemRows = useMemo(
    () =>
      items
        .map((it) => {
          const p = findProduct(it.productId);
          return p ? { ...it, product: p } : null;
        })
        .filter((x) => x !== null) as ({ product: ReturnType<typeof findProduct> } & (typeof items)[number])[],
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

  if (count === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Cart" />
        <EmptyState
          emoji="🛒"
          title="Your cart is calm"
          description="Browse the catalogue and we'll keep your saved items right here."
          ctaLabel="Start shopping"
          onPressCTA={() => rootNav.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Review cart" subtitle={`${count} items · ${formatMoney(subtotal)}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <GlassCard style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.palette.successSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="rocket" size={18} color={theme.palette.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Free express shipping unlocked
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                Most items will arrive in 24–48h.
              </Text>
            </View>
          </View>
        </GlassCard>

        {itemRows.map((row) => (
          <View
            key={row.id}
            style={[
              styles.itemCard,
              { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
            ]}
          >
            <Image source={{ uri: row.product!.thumbnail }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
                {row.product!.brand.toUpperCase()}
              </Text>
              <Text
                style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 4 }]}
                numberOfLines={2}
              >
                {row.product!.title}
              </Text>
              <View style={styles.itemMeta}>
                <Text style={[theme.typography.h4, { color: theme.palette.text }]}>
                  {formatMoney(multiplyMoney(row.unitPrice, row.quantity))}
                </Text>
              </View>
              <View style={[styles.itemActions, { borderColor: theme.palette.border }]}>
                <QuantitySelector
                  value={row.quantity}
                  onChange={(q) => updateQuantity(row.id, q)}
                  size="sm"
                />
                <AnimatedTouchable onPress={() => remove(row.id)} hapticKind="warning" style={styles.removeBtn}>
                  <Ionicons name="trash-outline" size={16} color={theme.palette.danger} />
                  <Text style={[theme.typography.captionStrong, { color: theme.palette.danger, marginLeft: 6 }]}>
                    Remove
                  </Text>
                </AnimatedTouchable>
              </View>
            </View>
          </View>
        ))}

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Order summary</Text>
          <SummaryRow label={`Subtotal · ${count} items`} value={formatMoney(subtotal)} />
          <SummaryRow label="Taxes (incl.)" value={formatMoney(taxes)} />
          <SummaryRow
            label="Shipping"
            value={shipping.amount === 0 ? 'Free' : formatMoney(shipping)}
          />
          <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
          <SummaryRow label="Estimated total" value={formatMoney(total)} bold />
        </GlassCard>

        <LinearGradient
          colors={theme.palette.gradientNeon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.savingsBanner]}
        >
          <Ionicons name="ribbon" size={18} color="#0B0F1A" />
          <Text
            style={[theme.typography.captionStrong, { color: '#0B0F1A', marginLeft: 8, flex: 1 }]}
          >
            You'll earn ₹{Math.round(total.amount * 0.05).toLocaleString('en-IN')} in cashback rewards 🎉
          </Text>
        </LinearGradient>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>Total</Text>
          <Text style={[theme.typography.h3, { color: theme.palette.text }]}>{formatMoney(total)}</Text>
        </View>
        <PrimaryButton
          title="Continue to checkout"
          iconRight="arrow-forward"
          variant="primary"
          fullWidth={false}
          onPress={() => {
            (rootNav as any).navigate('CartTab', { screen: 'AddressSelection' });
          }}
          style={{ paddingHorizontal: 18 }}
        />
      </View>
    </View>
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
  container: { flex: 1 },
  itemCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemImage: { width: 84, height: 84, borderRadius: 12 },
  itemMeta: { marginTop: 6 },
  itemActions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  removeBtn: { flexDirection: 'row', alignItems: 'center' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 6 },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
