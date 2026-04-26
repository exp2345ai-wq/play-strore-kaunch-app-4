import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CartStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useAddresses } from '../../store/AddressContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenHeader } from '../../components/ScreenHeader';
import { AddressCard } from '../../components/AddressCard';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<CartStackParamList, 'AddressSelection'>;

export const AddressSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { addresses, defaultAddress } = useAddresses();
  const [selectedId, setSelectedId] = useState<string | undefined>(defaultAddress?.id);

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Where to?" subtitle="Select a delivery address." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <GlassCard style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.palette.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="rocket" size={20} color={theme.palette.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Express delivery
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                Tomorrow before 5 PM, free for orders over ₹999.
              </Text>
            </View>
          </View>
        </GlassCard>

        {addresses.length === 0 ? (
          <EmptyState
            emoji="🏠"
            title="No addresses saved"
            description="Add one and we'll use it for super-fast checkout next time."
            ctaLabel="Add address"
            onPressCTA={() => navigation.navigate('AddAddressForm', {})}
          />
        ) : (
          addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              selected={selectedId === a.id}
              onPress={() => {
                haptic('selection');
                setSelectedId(a.id);
              }}
            />
          ))
        )}

        <AnimatedTouchable
          onPress={() => navigation.navigate('AddAddressForm', {})}
          hapticKind="selection"
          style={[
            styles.addBtn,
            { borderColor: theme.palette.border, backgroundColor: theme.palette.surface },
          ]}
        >
          <Ionicons name="add-circle" size={22} color={theme.palette.primary} />
          <Text style={[theme.typography.bodyStrong, { color: theme.palette.text, marginLeft: 10 }]}>
            Add a new address
          </Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
        </AnimatedTouchable>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <PrimaryButton
          title="Continue to payment"
          iconRight="arrow-forward"
          variant="primary"
          disabled={!selectedId}
          onPress={() => navigation.navigate('PaymentMethod', { addressId: selectedId! })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
