import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OrdersStackParamList, OrderStatus } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

import { initialOrders } from '../../data/orders';

import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { OrderCard } from '../../components/OrderCard';
import { FilterChip } from '../../components/FilterChip';
import { GlassCard } from '../../components/GlassCard';
import { EmptyState } from '../../components/EmptyState';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { sleep } from '../../utils/helpers';
import { formatMoney } from '../../utils/format';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrdersMain'>;

type Tab = 'all' | 'pending' | 'delivered' | 'cancelled';

export const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const [tab, setTab] = useState<Tab>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptic('medium');
    await sleep(700);
    setRefreshing(false);
  }, [haptic]);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'pending':
        return initialOrders.filter((o) =>
          (['placed', 'confirmed', 'packed', 'shipped', 'out-for-delivery'] as OrderStatus[]).includes(
            o.status
          )
        );
      case 'delivered':
        return initialOrders.filter((o) => o.status === 'delivered');
      case 'cancelled':
        return initialOrders.filter((o) =>
          (['cancelled', 'returned', 'refunded'] as OrderStatus[]).includes(o.status)
        );
      default:
        return initialOrders;
    }
  }, [tab]);

  const counts = useMemo(() => ({
    all: initialOrders.length,
    pending: initialOrders.filter((o) =>
      (['placed', 'confirmed', 'packed', 'shipped', 'out-for-delivery'] as OrderStatus[]).includes(
        o.status
      )
    ).length,
    delivered: initialOrders.filter((o) => o.status === 'delivered').length,
    cancelled: initialOrders.filter((o) =>
      (['cancelled', 'returned', 'refunded'] as OrderStatus[]).includes(o.status)
    ).length,
  }), []);

  const totalSpent = useMemo(
    () => initialOrders.reduce((sum, o) => sum + o.total.amount, 0),
    []
  );

  return (
    <ScreenContainer
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentStyle={{ paddingBottom: 200 }}
    >
      <ScreenHeader title="Your orders" subtitle="Track parcels, reorder, and download invoices." showBack={false} />

      <View style={{ paddingHorizontal: 16 }}>
        <LinearGradient
          colors={theme.palette.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statBanner}
        >
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.captionStrong, { color: '#FFFFFFAA' }]}>
              YOUR LIFETIME SAVINGS
            </Text>
            <Text style={[theme.typography.h2, { color: '#FFFFFF', marginTop: 4 }]}>
              {formatMoney({ amount: Math.round(totalSpent * 0.18), currency: 'INR' })}
            </Text>
            <Text style={[theme.typography.caption, { color: '#FFFFFFAA', marginTop: 4 }]}>
              Across {counts.all} orders · You're a Gold member
            </Text>
          </View>
          <View style={[styles.tierMedal, { backgroundColor: '#FFFFFFEE' }]}>
            <Ionicons name="trophy" size={26} color={theme.palette.accent} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 16 }}
      >
        <FilterChip label="All" active={tab === 'all'} onPress={() => setTab('all')} icon="apps" count={counts.all} />
        <FilterChip
          label="In transit"
          active={tab === 'pending'}
          onPress={() => setTab('pending')}
          icon="rocket"
          count={counts.pending}
        />
        <FilterChip
          label="Delivered"
          active={tab === 'delivered'}
          onPress={() => setTab('delivered')}
          icon="checkmark-circle"
          count={counts.delivered}
        />
        <FilterChip
          label="Cancelled"
          active={tab === 'cancelled'}
          onPress={() => setTab('cancelled')}
          icon="close-circle"
          count={counts.cancelled}
        />
      </ScrollView>

      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        {filtered.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="No orders here"
            description="Place an order and you'll see it neatly tracked in this tab."
          />
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              onPressTrack={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            />
          ))
        )}
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Help & support
          </Text>
          <View style={{ marginTop: 12 }}>
            {[
              { icon: 'chatbubbles', label: 'Chat with our team', desc: 'Avg. reply in 2 minutes' },
              { icon: 'mail', label: 'Email support', desc: 'help@shopx.app' },
              { icon: 'document-text', label: 'View FAQs', desc: 'Returns, exchanges, refunds' },
            ].map((item, idx) => (
              <AnimatedTouchable
                key={idx}
                hapticKind="light"
                onPress={() => {}}
                style={[
                  styles.helpRow,
                  { borderColor: theme.palette.border },
                ]}
              >
                <View style={[styles.helpIcon, { backgroundColor: theme.palette.primarySoft }]}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={16} color={theme.palette.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]}>
                    {item.label}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                    {item.desc}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
              </AnimatedTouchable>
            ))}
          </View>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  statBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
  },
  tierMedal: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
