import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { OrdersStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findOrder } from '../../data/orders';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<OrdersStackParamList, 'Reorder'>;

export const ReorderScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { add } = useCart();
  const order = findOrder(route.params.orderId);
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Reorder" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          Order not found.
        </Text>
      </View>
    );
  }

  const itemsToReorder = order.items.filter((it) => !excluded[it.productId]);
  const total = itemsToReorder.reduce((s, it) => s + it.totalPrice.amount, 0);

  const handleReorder = () => {
    haptic('success');
    itemsToReorder.forEach((it) => add(it.productId, [], it.unitPrice));
    Toast.show({
      type: 'success',
      text1: `${itemsToReorder.length} items added to cart`,
      text2: 'Review your bag and check out.',
    });
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Reorder" subtitle={`From ${order.orderNumber}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <LinearGradient
          colors={theme.palette.gradientAurora}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <Ionicons name="repeat" size={20} color="#FFF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[theme.typography.captionStrong, { color: '#FFFFFFAA' }]}>
              ONE-TAP REORDER
            </Text>
            <Text style={[theme.typography.subtitle, { color: '#FFFFFF', marginTop: 2 }]}>
              We'll re-add everything to your cart instantly.
            </Text>
          </View>
        </LinearGradient>

        <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 18 }]}>
          Choose what to add back
        </Text>

        {order.items.map((it) => {
          const isExcluded = !!excluded[it.productId];
          return (
            <AnimatedTouchable
              key={it.productId}
              hapticKind="selection"
              onPress={() =>
                setExcluded((prev) => ({ ...prev, [it.productId]: !prev[it.productId] }))
              }
              style={[
                styles.itemCard,
                {
                  backgroundColor: theme.palette.surface,
                  borderColor: isExcluded ? theme.palette.danger : theme.palette.border,
                  opacity: isExcluded ? 0.5 : 1,
                },
              ]}
            >
              <Image source={{ uri: it.productThumbnail }} style={styles.itemImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
                  {it.brand.toUpperCase()}
                </Text>
                <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 2 }]} numberOfLines={2}>
                  {it.productTitle}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                  {it.variantSummary} · Qty {it.quantity}
                </Text>
                <Text style={[theme.typography.h4, { color: theme.palette.text, marginTop: 6 }]}>
                  {formatMoney(it.totalPrice)}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isExcluded ? theme.palette.surfaceHigh : theme.palette.primary,
                    borderColor: isExcluded ? theme.palette.border : theme.palette.primary,
                  },
                ]}
              >
                {!isExcluded ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
              </View>
            </AnimatedTouchable>
          );
        })}

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            What's added
          </Text>
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[theme.typography.body, { color: theme.palette.textSecondary }]}>
              Items
            </Text>
            <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]}>
              {itemsToReorder.length} of {order.items.length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[theme.typography.body, { color: theme.palette.textSecondary }]}>
              Estimated cart value
            </Text>
            <Text style={[theme.typography.h3, { color: theme.palette.text }]}>
              {formatMoney({ amount: total, currency: order.total.currency })}
            </Text>
          </View>
        </GlassCard>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <PrimaryButton
          title="Cancel"
          variant="glass"
          onPress={() => navigation.goBack()}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title={`Add ${itemsToReorder.length} to cart`}
          variant="primary"
          iconLeft="bag-handle"
          disabled={itemsToReorder.length === 0}
          onPress={handleReorder}
          fullWidth={false}
          style={{ flex: 1.4, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 10,
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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
