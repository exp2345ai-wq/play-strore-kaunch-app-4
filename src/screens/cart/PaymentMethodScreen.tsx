import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { CartStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useAddresses } from '../../store/AddressContext';
import { useHaptics } from '../../hooks/useHaptics';

import { paymentMethods } from '../../data/paymentMethods';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

import { formatMoney } from '../../utils/format';
import { sumMoney } from '../../utils/helpers';

type Props = NativeStackScreenProps<CartStackParamList, 'PaymentMethod'>;

export const PaymentMethodScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { subtotal, count, clear } = useCart();
  const { addresses } = useAddresses();
  const address = addresses.find((a) => a.id === route.params.addressId);
  const [selected, setSelected] = useState(paymentMethods[0]?.id);

  const taxes = useMemo(
    () => ({ amount: Math.round(subtotal.amount * 0.05), currency: subtotal.currency }),
    [subtotal]
  );
  const shipping = useMemo(
    () => ({ amount: subtotal.amount > 999 ? 0 : 49, currency: subtotal.currency }),
    [subtotal]
  );
  const total = useMemo(() => sumMoney([subtotal, taxes, shipping]), [subtotal, taxes, shipping]);

  const handlePlace = () => {
    haptic('success');
    clear();
    Toast.show({
      type: 'success',
      text1: 'Order placed!',
      text2: 'Your goodies are on their way.',
    });
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader
        title="Payment"
        subtitle={address ? `Delivering to ${address.fullName}` : 'Select a payment method.'}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 220 }}>
        <LinearGradient
          colors={theme.palette.gradientNeon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cashbackCard}
        >
          <Ionicons name="wallet" size={20} color="#0B0F1A" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[theme.typography.captionStrong, { color: '#0B0F1A' }]}>
              EXTRA 5% CASHBACK
            </Text>
            <Text style={[theme.typography.subtitle, { color: '#0B0F1A', marginTop: 2 }]}>
              Pay with ShopX UPI for instant rewards
            </Text>
          </View>
        </LinearGradient>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Choose a method
          </Text>
          <View style={{ marginTop: 12 }}>
            {paymentMethods.map((p) => {
              const active = selected === p.id;
              return (
                <AnimatedTouchable
                  key={p.id}
                  onPress={() => setSelected(p.id)}
                  hapticKind="selection"
                  style={[
                    styles.methodRow,
                    {
                      borderColor: active ? theme.palette.primary : theme.palette.border,
                      backgroundColor: theme.palette.surface,
                    },
                  ]}
                >
                  <View style={[styles.methodIcon, { backgroundColor: theme.palette.primarySoft }]}>
                    <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                      {p.label}
                    </Text>
                    {p.cashback ? (
                      <Text style={[theme.typography.caption, { color: theme.palette.success, marginTop: 2 }]}>
                        Earn {p.cashback}% cashback
                      </Text>
                    ) : (
                      <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                        Secure & instant
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: active ? theme.palette.primary : theme.palette.border,
                      },
                    ]}
                  >
                    {active ? (
                      <View
                        style={[styles.radioInner, { backgroundColor: theme.palette.primary }]}
                      />
                    ) : null}
                  </View>
                </AnimatedTouchable>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Order summary</Text>
          <SummaryRow label={`Subtotal · ${count} items`} value={formatMoney(subtotal)} />
          <SummaryRow label="Taxes (incl.)" value={formatMoney(taxes)} />
          <SummaryRow label="Shipping" value={shipping.amount === 0 ? 'Free' : formatMoney(shipping)} />
          <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
          <SummaryRow label="Total payable" value={formatMoney(total)} bold />
        </GlassCard>

        {address ? (
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
              Shipping to
            </Text>
            <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 6 }]}>
              {address.fullName} · {address.phone}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
              {address.flat}, {address.area}, {address.city}, {address.state} – {address.pincode}
            </Text>
          </GlassCard>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted }]}>Total</Text>
          <Text style={[theme.typography.h3, { color: theme.palette.text }]}>{formatMoney(total)}</Text>
        </View>
        <PrimaryButton
          title="Place order"
          iconRight="checkmark-circle"
          variant="primary"
          onPress={handlePlace}
          fullWidth={false}
          style={{ paddingHorizontal: 22 }}
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
  cashbackCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14 },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 6 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
