import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Order } from '../types';
import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';
import { formatMoney, formatDate } from '../utils/format';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onPressTrack?: () => void;
}

const statusGradient: Record<Order['status'], [string, string]> = {
  placed: ['#5B5BFF', '#3D3DEB'],
  confirmed: ['#5B5BFF', '#3D3DEB'],
  packed: ['#5BC0FF', '#3596F6'],
  shipped: ['#5BC0FF', '#3596F6'],
  'out-for-delivery': ['#FFA64D', '#FF6F4D'],
  delivered: ['#3DD598', '#1AAE6F'],
  cancelled: ['#FF6E8A', '#E0395A'],
  returned: ['#FFC857', '#F2A700'],
  refunded: ['#A877FF', '#7D5FFF'],
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, onPressTrack }) => {
  const theme = useTheme();
  const gradient = statusGradient[order.status];
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="light"
      style={[
        styles.card,
        { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>
            {order.orderNumber}
          </Text>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 2 }]}>
            Placed on {formatDate(order.placedAt)}
          </Text>
        </View>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.status}
        >
          <Text style={[theme.typography.micro, { color: '#FFFFFF' }]}>
            {order.status.replace('-', ' ').toUpperCase()}
          </Text>
        </LinearGradient>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />

      <View style={styles.itemsRow}>
        <View style={{ flexDirection: 'row' }}>
          {order.items.slice(0, 4).map((it, idx) => (
            <Image
              key={`${it.productId}-${idx}`}
              source={{ uri: it.productThumbnail }}
              style={[
                styles.itemThumb,
                {
                  marginLeft: idx === 0 ? 0 : -10,
                  borderColor: theme.palette.surface,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]} numberOfLines={1}>
            {order.items[0]?.productTitle ?? 'Items'}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
            {itemCount} item{itemCount === 1 ? '' : 's'} · {formatMoney(order.total)}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        {order.status !== 'cancelled' && order.status !== 'refunded' ? (
          <AnimatedTouchable
            onPress={onPressTrack}
            hapticKind="selection"
            style={[styles.trackBtn, { borderColor: theme.palette.primary }]}
          >
            <Ionicons name="navigate" size={14} color={theme.palette.primary} />
            <Text
              style={[
                theme.typography.captionStrong,
                { color: theme.palette.primary, marginLeft: 6 },
              ]}
            >
              Track package
            </Text>
          </AnimatedTouchable>
        ) : null}
        <View style={{ flex: 1 }} />
        <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  itemsRow: { flexDirection: 'row', alignItems: 'center' },
  itemThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
});
