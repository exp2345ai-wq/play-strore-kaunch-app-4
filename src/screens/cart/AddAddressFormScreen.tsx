import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { Address, CartStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useAddresses } from '../../store/AddressContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FilterChip } from '../../components/FilterChip';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

type Props = NativeStackScreenProps<CartStackParamList, 'AddAddressForm'>;

type FormState = {
  fullName: string;
  phone: string;
  pincode: string;
  flat: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  type: Address['type'];
  isDefault: boolean;
};

const INITIAL_FORM: FormState = {
  fullName: '',
  phone: '',
  pincode: '',
  flat: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  type: 'home',
  isDefault: false,
};

export const AddAddressFormScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { upsert } = useAddresses();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.fullName.length > 1 &&
    form.phone.length >= 10 &&
    form.pincode.length === 6 &&
    form.flat.length > 0 &&
    form.area.length > 0 &&
    form.city.length > 0 &&
    form.state.length > 0;

  const handleSave = () => {
    if (!isValid) return;
    haptic('success');
    const id = `addr-${Date.now()}`;
    upsert({
      id,
      country: 'India',
      ...form,
    });
    Toast.show({ type: 'success', text1: 'Address saved', text2: form.fullName });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Add new address" subtitle="We'll deliver right to your door." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 220 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Contact</Text>
          <Field
            label="Full name"
            placeholder="Aanya Sharma"
            value={form.fullName}
            onChangeText={(v) => setField('fullName', v)}
            icon="person"
          />
          <Field
            label="Phone number"
            placeholder="98765 43210"
            value={form.phone}
            onChangeText={(v) => setField('phone', v.replace(/[^0-9]/g, ''))}
            keyboardType="phone-pad"
            icon="call"
            maxLength={10}
          />
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Address</Text>
          <Field
            label="Pincode"
            placeholder="560001"
            value={form.pincode}
            onChangeText={(v) => setField('pincode', v.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            icon="map"
            maxLength={6}
          />
          <Field
            label="Flat / Building"
            placeholder="A-201, Lumen Heights"
            value={form.flat}
            onChangeText={(v) => setField('flat', v)}
            icon="business"
          />
          <Field
            label="Area / Street"
            placeholder="HSR Layout, Sector 4"
            value={form.area}
            onChangeText={(v) => setField('area', v)}
            icon="location"
          />
          <Field
            label="Landmark (optional)"
            placeholder="Opposite metro station"
            value={form.landmark}
            onChangeText={(v) => setField('landmark', v)}
            icon="navigate"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field
                label="City"
                placeholder="Bengaluru"
                value={form.city}
                onChangeText={(v) => setField('city', v)}
                icon="business-outline"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="State"
                placeholder="Karnataka"
                value={form.state}
                onChangeText={(v) => setField('state', v)}
                icon="flag"
              />
            </View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Save as
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {(['home', 'work', 'other'] as Address['type'][]).map((t) => (
              <FilterChip
                key={t}
                label={t === 'home' ? 'Home' : t === 'work' ? 'Work' : 'Other'}
                active={form.type === t}
                onPress={() => setField('type', t)}
                icon={t === 'home' ? 'home' : t === 'work' ? 'briefcase' : 'pin'}
              />
            ))}
          </View>
          <AnimatedTouchable
            onPress={() => setField('isDefault', !form.isDefault)}
            hapticKind="selection"
            style={styles.toggleRow}
          >
            <Text style={[theme.typography.body, { color: theme.palette.text, flex: 1 }]}>
              Make this the default address
            </Text>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: form.isDefault ? theme.palette.primary : theme.palette.surfaceHigh,
                  borderColor: form.isDefault ? theme.palette.primary : theme.palette.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    transform: [{ translateX: form.isDefault ? 18 : 0 }],
                  },
                ]}
              />
            </View>
          </AnimatedTouchable>
        </GlassCard>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}>
        <PrimaryButton
          title="Cancel"
          variant="glass"
          onPress={() => navigation.goBack()}
          fullWidth={false}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Save address"
          variant="primary"
          iconLeft="save"
          onPress={handleSave}
          disabled={!isValid}
          fullWidth={false}
          style={{ flex: 1.4, marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const Field: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad' | 'email-address';
  maxLength?: number;
}> = ({ label, placeholder, value, onChangeText, icon, keyboardType = 'default', maxLength }) => {
  const theme = useTheme();
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>{label}</Text>
      <View
        style={[
          styles.field,
          { backgroundColor: theme.palette.surfaceHigh, borderColor: theme.palette.border },
        ]}
      >
        <Ionicons name={icon} size={16} color={theme.palette.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.palette.textMuted}
          keyboardType={keyboardType}
          maxLength={maxLength}
          style={[styles.fieldInput, theme.typography.body, { color: theme.palette.text }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 6,
    gap: 8,
  },
  fieldInput: { flex: 1, paddingVertical: 0 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  toggle: { width: 44, height: 26, borderRadius: 13, padding: 2, justifyContent: 'center', borderWidth: 1 },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
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
