import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OrdersStackParamList, OrderStatus } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

import { findOrder } from '../../data/orders';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { formatDateTime } from '../../utils/format';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderTracking'>;

const statusIcon: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  placed: 'cart',
  confirmed: 'checkmark-circle',
  packed: 'cube',
  shipped: 'rocket',
  'out-for-delivery': 'bicycle',
  delivered: 'home',
  cancelled: 'close-circle',
  returned: 'refresh',
  refunded: 'card',
};

export const OrderTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const order = findOrder(route.params.orderId);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Tracking" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          Tracking unavailable for this order.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Tracking" subtitle={order.orderNumber} />
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <LinearGradient
            colors={theme.palette.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mapMock}
          >
            <View style={styles.mapOverlay}>
              <View style={[styles.routeLine, { backgroundColor: '#FFFFFFAA' }]} />
              <View style={[styles.dotStart, { backgroundColor: '#FFFFFF' }]} />
              <View style={[styles.dotEnd, { backgroundColor: '#FFE066' }]} />
              <View style={[styles.bike, { backgroundColor: '#FFFFFFEE' }]}>
                <Ionicons name="bicycle" size={20} color={theme.palette.primary} />
              </View>
            </View>
            <View style={styles.mapInfo}>
              <Text style={[theme.typography.captionStrong, { color: '#FFFFFFCC' }]}>
                LIVE TRACKING (DEMO)
              </Text>
              <Text style={[theme.typography.h3, { color: '#FFFFFF', marginTop: 4 }]}>
                Arriving in approx. 22 minutes
              </Text>
              <Text style={[theme.typography.caption, { color: '#FFFFFFAA', marginTop: 4 }]}>
                Rider: Karthik V · ★ 4.9 · {order.trackingId ?? 'TRK-X4992'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginBottom: 12 }]}>
            Timeline
          </Text>
          <View style={[styles.timelineCard, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
            {order.timeline.map((entry, idx) => {
              const isLast = idx === order.timeline.length - 1;
              const tint = entry.completed ? theme.palette.success : theme.palette.textMuted;
              return (
                <View key={idx} style={{ flexDirection: 'row' }}>
                  <View style={{ alignItems: 'center', width: 32 }}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: entry.completed ? theme.palette.success : theme.palette.surfaceHigh,
                          borderColor: tint,
                        },
                      ]}
                    >
                      <Ionicons
                        name={statusIcon[entry.status]}
                        size={12}
                        color={entry.completed ? '#FFFFFF' : theme.palette.textMuted}
                      />
                    </View>
                    {!isLast ? (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: entry.completed ? theme.palette.success : theme.palette.divider },
                        ]}
                      />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 18 }}>
                    <Text
                      style={[
                        theme.typography.subtitle,
                        { color: entry.completed ? theme.palette.text : theme.palette.textMuted },
                      ]}
                    >
                      {entry.title}
                    </Text>
                    <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                      {entry.description}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                      <Ionicons name="time-outline" size={12} color={theme.palette.textMuted} />
                      <Text style={[theme.typography.micro, { color: theme.palette.textMuted, marginLeft: 4 }]}>
                        {formatDateTime(entry.timestamp)}
                      </Text>
                      {entry.location ? (
                        <>
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color={theme.palette.textMuted}
                            style={{ marginLeft: 8 }}
                          />
                          <Text style={[theme.typography.micro, { color: theme.palette.textMuted, marginLeft: 4 }]}>
                            {entry.location}
                          </Text>
                        </>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <GlassCard>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Quick actions
            </Text>
            <View style={{ marginTop: 12, gap: 10 }}>
              <ActionRow
                icon="call"
                label="Call rider"
                description="Direct line to your courier"
                onPress={() => {}}
              />
              <ActionRow
                icon="chatbubble-ellipses"
                label="Send message"
                description="Drop instructions for delivery"
                onPress={() => {}}
              />
              <ActionRow
                icon="lock-closed"
                label="Add a delivery code"
                description="Extra protection on hand-off"
                onPress={() => {}}
              />
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <PrimaryButton
          title="Reorder"
          variant="glass"
          iconLeft="repeat"
          onPress={() => navigation.navigate('Reorder', { orderId: order.id })}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="View order"
          variant="primary"
          iconLeft="cube"
          onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          fullWidth={false}
          style={{ flex: 1, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const ActionRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
}> = ({ icon, label, description, onPress }) => {
  const theme = useTheme();
  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="light"
      style={[styles.actionRow, { borderColor: theme.palette.border }]}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.palette.primarySoft }]}>
        <Ionicons name={icon} size={16} color={theme.palette.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>{label}</Text>
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapMock: {
    height: 240,
    borderRadius: 22,
    overflow: 'hidden',
  },
  mapOverlay: { ...StyleSheet.absoluteFillObject },
  routeLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 80,
    height: 4,
    borderRadius: 2,
  },
  dotStart: {
    position: 'absolute',
    left: 18,
    top: 74,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotEnd: {
    position: 'absolute',
    right: 18,
    top: 74,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  bike: {
    position: 'absolute',
    left: '40%',
    top: 64,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapInfo: { position: 'absolute', bottom: 0, padding: 18 },
  timelineCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  timelineLine: { width: 2, flex: 1, marginTop: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1 },
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
