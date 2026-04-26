import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useAddresses } from '../../store/AddressContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenHeader } from '../../components/ScreenHeader';
import { AddressCard } from '../../components/AddressCard';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddressList'>;

export const AddressListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { addresses } = useAddresses();

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Saved addresses" subtitle={`${addresses.length} on file`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <GlassCard style={{ marginBottom: 14 }}>
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
              <Ionicons name="map" size={20} color={theme.palette.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
                Your places
              </Text>
              <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                Tap an address to edit, set default, or delete.
              </Text>
            </View>
          </View>
        </GlassCard>

        {addresses.length === 0 ? (
          <EmptyState
            emoji="🗺️"
            title="No addresses saved"
            description="Add your first home or work spot for one-tap checkout."
            ctaLabel="Add address"
            onPressCTA={() =>
              (navigation as any).navigate('CartTab', {
                screen: 'AddAddressForm',
              })
            }
          />
        ) : (
          addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              onPress={() => {
                haptic('light');
                navigation.navigate('AddressDetail', { addressId: a.id });
              }}
            />
          ))
        )}

        <AnimatedTouchable
          onPress={() =>
            (navigation as any).navigate('CartTab', { screen: 'AddAddressForm' })
          }
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
        </AnimatedTouchable>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
        ]}
      >
        <PrimaryButton
          title="Done"
          variant="primary"
          iconLeft="checkmark"
          onPress={() => navigation.goBack()}
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
    justifyContent: 'center',
    marginTop: 12,
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
