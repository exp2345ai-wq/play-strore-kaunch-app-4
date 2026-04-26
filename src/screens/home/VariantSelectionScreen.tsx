import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { HomeStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findProduct } from '../../data/products';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { QuantitySelector } from '../../components/QuantitySelector';

import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<HomeStackParamList, 'VariantSelection'>;

export const VariantSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { add } = useCart();

  const product = findProduct(route.params.productId);
  const [colorId, setColorId] = useState<string | undefined>(
    product?.variants.find((v) => v.type === 'color')?.id
  );
  const [sizeId, setSizeId] = useState<string | undefined>(
    product?.variants.find((v) => v.type !== 'color')?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);

  const colorVariants = useMemo(
    () => product?.variants.filter((v) => v.type === 'color') ?? [],
    [product]
  );
  const sizeVariants = useMemo(
    () => product?.variants.filter((v) => v.type !== 'color') ?? [],
    [product]
  );

  const totalPriceModifier = useMemo(() => {
    const c = product?.variants.find((v) => v.id === colorId)?.priceModifier ?? 0;
    const s = product?.variants.find((v) => v.id === sizeId)?.priceModifier ?? 0;
    return c + s;
  }, [colorId, sizeId, product]);

  if (!product) return null;

  const totalAmount = (product.price.amount + totalPriceModifier) * quantity + (giftWrap ? 99 : 0);
  const total = { amount: totalAmount, currency: product.price.currency };

  const handleAdd = () => {
    haptic('success');
    const variantIds = [colorId, sizeId].filter(Boolean) as string[];
    add(product.id, variantIds, {
      amount: product.price.amount + totalPriceModifier,
      currency: product.price.currency,
    });
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${quantity} × ${product.title}`,
    });
    navigation.replace('CartReview');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Pick your variant" subtitle="Choose color, size and quantity." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
        <LinearGradient
          colors={theme.palette.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { borderColor: theme.palette.border }]}
        >
          <Image source={{ uri: product.thumbnail }} style={styles.heroImage} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
              {product.brand.toUpperCase()}
            </Text>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 4 }]} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={[theme.typography.h3, { color: theme.palette.text, marginTop: 6 }]}>
              {formatMoney(product.price)}
            </Text>
          </View>
        </LinearGradient>

        {colorVariants.length > 0 ? (
          <View style={styles.section}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Color</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingTop: 10 }}
            >
              {colorVariants.map((v) => {
                const active = colorId === v.id;
                return (
                  <AnimatedTouchable
                    key={v.id}
                    hapticKind="selection"
                    onPress={() => setColorId(v.id)}
                  >
                    <View
                      style={[
                        styles.swatch,
                        {
                          backgroundColor: v.hex ?? theme.palette.surface,
                          borderColor: active ? theme.palette.primary : theme.palette.border,
                          borderWidth: active ? 3 : 2,
                          opacity: v.inStock ? 1 : 0.4,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        theme.typography.micro,
                        {
                          color: active ? theme.palette.primary : theme.palette.textMuted,
                          marginTop: 4,
                          textAlign: 'center',
                        },
                      ]}
                    >
                      {v.value}
                    </Text>
                  </AnimatedTouchable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {sizeVariants.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                {sizeVariants[0].label}
              </Text>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
                Size guide
              </Text>
            </View>
            <View style={styles.sizeGrid}>
              {sizeVariants.map((v) => {
                const active = sizeId === v.id;
                return (
                  <AnimatedTouchable
                    key={v.id}
                    onPress={() => setSizeId(v.id)}
                    hapticKind="selection"
                    style={[
                      styles.sizeChip,
                      {
                        backgroundColor: active ? theme.palette.primary : theme.palette.surface,
                        borderColor: active ? theme.palette.primary : theme.palette.border,
                        opacity: v.inStock ? 1 : 0.4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        theme.typography.captionStrong,
                        { color: active ? theme.palette.onPrimary : theme.palette.text },
                      ]}
                    >
                      {v.value}
                    </Text>
                    {v.priceModifier ? (
                      <Text
                        style={[
                          theme.typography.micro,
                          {
                            color: active ? theme.palette.onPrimary : theme.palette.textMuted,
                            marginTop: 2,
                          },
                        ]}
                      >
                        +{formatMoney({ amount: v.priceModifier, currency: product.price.currency })}
                      </Text>
                    ) : null}
                  </AnimatedTouchable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Quantity</Text>
          <View style={[styles.qtyRow, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
            <Text style={[theme.typography.body, { color: theme.palette.textMuted }]}>
              How many would you like?
            </Text>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </View>
        </View>

        <View style={styles.section}>
          <AnimatedTouchable
            onPress={() => setGiftWrap((g) => !g)}
            hapticKind="selection"
            style={[
              styles.giftRow,
              {
                backgroundColor: theme.palette.surface,
                borderColor: giftWrap ? theme.palette.primary : theme.palette.border,
              },
            ]}
          >
            <View style={[styles.giftIcon, { backgroundColor: theme.palette.accentSoft }]}>
              <Ionicons name="gift" size={20} color={theme.palette.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Add gift wrapping
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                Premium gift box, ribbon and a personalized note · ₹99
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: giftWrap ? theme.palette.primary : theme.palette.surfaceHigh,
                  borderColor: giftWrap ? theme.palette.primary : theme.palette.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: '#fff',
                    transform: [{ translateX: giftWrap ? 18 : 0 }],
                  },
                ]}
              />
            </View>
          </AnimatedTouchable>
        </View>

        <GlassCard style={{ marginTop: 18 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Order summary
          </Text>
          <SummaryRow label="Item subtotal" value={formatMoney({ amount: product.price.amount * quantity, currency: product.price.currency })} />
          <SummaryRow label="Variant adjustments" value={formatMoney({ amount: totalPriceModifier * quantity, currency: product.price.currency })} />
          {giftWrap ? (
            <SummaryRow label="Gift wrap" value={formatMoney({ amount: 99, currency: product.price.currency })} />
          ) : null}
          <View style={[styles.summaryDivider, { backgroundColor: theme.palette.divider }]} />
          <SummaryRow label="Total" value={formatMoney(total)} bold />
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>Total</Text>
          <Text style={[theme.typography.h3, { color: theme.palette.text }]}>
            {formatMoney(total)}
          </Text>
        </View>
        <PrimaryButton
          title="Add to cart"
          iconLeft="bag-handle"
          variant="primary"
          onPress={handleAdd}
          fullWidth={false}
          style={{ paddingHorizontal: 28 }}
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
      <Text
        style={[
          bold ? theme.typography.h3 : theme.typography.bodyStrong,
          { color: theme.palette.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  heroImage: { width: 90, height: 90, borderRadius: 14 },
  section: { marginTop: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  swatch: { width: 48, height: 48, borderRadius: 24 },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  sizeChip: {
    minWidth: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    gap: 12,
  },
  giftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  giftIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryDivider: { height: StyleSheet.hairlineWidth, marginVertical: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
