import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useAddresses } from '../../store/AddressContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddressDetail'>;

export const AddressDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { addresses, setDefault, remove } = useAddresses();
  const address = addresses.find((a) => a.id === route.params.addressId);

  if (!address) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Address" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          This address has been deleted.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Address" subtitle="Tap any action to manage." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <LinearGradient
          colors={theme.palette.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, { borderColor: theme.palette.border }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    address.type === 'home'
                      ? theme.palette.success
                      : address.type === 'work'
                        ? theme.palette.warning
                        : theme.palette.primary,
                },
              ]}
            >
              <Ionicons
                name={address.type === 'home' ? 'home' : address.type === 'work' ? 'briefcase' : 'pin'}
                size={20}
                color="#FFFFFF"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
                {address.type.toUpperCase()}{address.isDefault ? ' · DEFAULT' : ''}
              </Text>
              <Text style={[theme.typography.h3, { color: theme.palette.text, marginTop: 2 }]}>
                {address.fullName}
              </Text>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.textSecondary, marginTop: 2 }]}>
                {address.phone}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
          <Text style={[theme.typography.body, { color: theme.palette.text }]}>
            {address.flat}
          </Text>
          <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 4 }]}>
            {address.area}
          </Text>
          {address.landmark ? (
            <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
              Landmark · {address.landmark}
            </Text>
          ) : null}
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
            {address.city}, {address.state} – {address.pincode}
          </Text>
        </LinearGradient>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Actions</Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {!address.isDefault ? (
              <ActionRow
                icon="star"
                label="Make default"
                description="We'll auto-fill this address at checkout."
                onPress={() => {
                  haptic('success');
                  setDefault(address.id);
                  Toast.show({ type: 'success', text1: 'Set as default' });
                  navigation.goBack();
                }}
              />
            ) : null}
            <ActionRow
              icon="create"
              label="Edit address"
              description="Update name, phone, or address details"
              onPress={() => {
                (navigation as any).navigate('CartTab', {
                  screen: 'AddAddressForm',
                  params: { addressId: address.id },
                });
              }}
            />
            <ActionRow
              icon="navigate"
              label="Get directions"
              description="Opens a mock map preview"
              onPress={() => Toast.show({ type: 'info', text1: 'Opening directions…' })}
            />
            <ActionRow
              icon="trash"
              label="Delete address"
              description="Permanently remove from your account"
              danger
              onPress={() => {
                haptic('warning');
                remove(address.id);
                Toast.show({ type: 'success', text1: 'Address removed' });
                navigation.goBack();
              }}
            />
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Delivery preferences
          </Text>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 8 }]}>
            We'll deliver between 9 AM and 9 PM. Couriers ring the bell exactly once.
          </Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            <Pref
              icon="time"
              label="Default time slot"
              value="Anytime"
            />
            <Pref icon="lock-closed" label="Contactless drop" value="Off" />
            <Pref icon="key" label="Gate code" value="—" />
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
          title="Back"
          variant="glass"
          onPress={() => navigation.goBack()}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Edit address"
          variant="primary"
          iconLeft="create"
          onPress={() => {
            (navigation as any).navigate('CartTab', {
              screen: 'AddAddressForm',
              params: { addressId: address.id },
            });
          }}
          fullWidth={false}
          style={{ flex: 1.4, marginLeft: 12 }}
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
  danger?: boolean;
}> = ({ icon, label, description, onPress, danger }) => {
  const theme = useTheme();
  const tint = danger ? theme.palette.danger : theme.palette.primary;
  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind={danger ? 'warning' : 'light'}
      style={[styles.actionRow, { borderColor: theme.palette.border }]}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${tint}22` }]}>
        <Ionicons name={icon} size={18} color={tint} />
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

const Pref: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <View style={[styles.prefRow]}>
      <View style={[styles.prefIcon, { backgroundColor: theme.palette.primarySoft }]}>
        <Ionicons name={icon} size={14} color={theme.palette.primary} />
      </View>
      <Text style={[theme.typography.body, { color: theme.palette.text, flex: 1, marginLeft: 12 }]}>{label}</Text>
      <Text style={[theme.typography.bodyStrong, { color: theme.palette.textSecondary }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCard: { padding: 18, borderRadius: 22, borderWidth: 1 },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1 },
  actionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  prefRow: { flexDirection: 'row', alignItems: 'center' },
  prefIcon: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
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
