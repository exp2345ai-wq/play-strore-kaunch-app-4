import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { OrdersStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

import { findOrder } from '../../data/orders';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { formatDate, formatDateTime, formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const order = findOrder(route.params.orderId);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Order" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          We couldn't find this order. It might have been archived.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <ScreenHeader title="Order details" subtitle={order.orderNumber} />

        <View style={{ paddingHorizontal: 16 }}>
          <LinearGradient
            colors={theme.palette.gradientCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.statusCard, { borderColor: theme.palette.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>
                STATUS
              </Text>
              <Text style={[theme.typography.h2, { color: theme.palette.text, marginTop: 4 }]}>
                {order.status === 'delivered'
                  ? 'Delivered'
                  : order.status === 'out-for-delivery'
                    ? 'Out for delivery'
                    : order.status[0].toUpperCase() + order.status.slice(1)}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
                Placed on {formatDateTime(order.placedAt)}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textSecondary, marginTop: 2 }]}>
                Estimated delivery · {formatDate(order.estimatedDelivery)}
              </Text>
            </View>
            <AnimatedTouchable
              hapticKind="light"
              onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
              style={[styles.trackBtn, { backgroundColor: theme.palette.primary }]}
            >
              <Ionicons name="navigate" size={16} color={theme.palette.onPrimary} />
              <Text style={[theme.typography.captionStrong, { color: theme.palette.onPrimary, marginLeft: 6 }]}>
                Track
              </Text>
            </AnimatedTouchable>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginBottom: 8 }]}>
            Items in this order
          </Text>
          {order.items.map((it, idx) => (
            <View
              key={`${it.productId}-${idx}`}
              style={[
                styles.itemCard,
                { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
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
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <GlassCard>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Bill summary
            </Text>
            <SummaryRow label="Subtotal" value={formatMoney(order.subtotal)} />
            <SummaryRow label="Shipping" value={order.shippingFee.amount === 0 ? 'Free' : formatMoney(order.shippingFee)} />
            <SummaryRow label="Taxes" value={formatMoney(order.taxes)} />
            {order.discount.amount > 0 ? (
              <SummaryRow label="Discount" value={`- ${formatMoney(order.discount)}`} highlight />
            ) : null}
            <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
            <SummaryRow label="Total paid" value={formatMoney(order.total)} bold />
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 8 }]}>
              Paid via {order.paymentLabel}
            </Text>
          </GlassCard>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <GlassCard>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Shipping to
            </Text>
            <Text style={[theme.typography.body, { color: theme.palette.text, marginTop: 8 }]}>
              {order.shippingAddress.fullName}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.palette.textSecondary, marginTop: 2 }]}>
              {order.shippingAddress.flat}, {order.shippingAddress.area}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
              {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
            </Text>
            <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginTop: 8 }]}>
              {order.shippingAddress.phone}
            </Text>
          </GlassCard>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <GlassCard>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Need help?
            </Text>
            <View style={{ marginTop: 12, gap: 10 }}>
              <ActionRow
                icon="repeat"
                label="Reorder these items"
                onPress={() => navigation.navigate('Reorder', { orderId: order.id })}
              />
              <ActionRow
                icon="document-text"
                label="Download invoice"
                onPress={() => Toast.show({ type: 'info', text1: 'Generating invoice…' })}
              />
              <ActionRow
                icon="chatbubbles"
                label="Talk to support"
                onPress={() => Toast.show({ type: 'info', text1: 'Connecting to ShopX care…' })}
              />
              <ActionRow
                icon="refresh"
                label="Return / Exchange"
                onPress={() => Toast.show({ type: 'info', text1: 'Return window opens after delivery' })}
              />
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <PrimaryButton
          title="Track order"
          variant="glass"
          iconLeft="navigate"
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Reorder"
          variant="primary"
          iconLeft="repeat"
          onPress={() => navigation.navigate('Reorder', { orderId: order.id })}
          fullWidth={false}
          style={{ flex: 1, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const SummaryRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}> = ({ label, value, bold, highlight }) => {
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
          {
            color: highlight ? theme.palette.success : theme.palette.text,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const ActionRow: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }> = ({
  icon,
  label,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="light"
      style={[
        styles.actionRow,
        { borderColor: theme.palette.border },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.palette.primarySoft }]}>
        <Ionicons name={icon} size={16} color={theme.palette.primary} />
      </View>
      <Text style={[theme.typography.subtitle, { color: theme.palette.text, flex: 1, marginLeft: 12 }]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 6 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
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
