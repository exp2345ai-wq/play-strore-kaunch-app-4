import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { FilterChip } from '../../components/FilterChip';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const GENDERS: { id: 'female' | 'male' | 'other' | 'prefer-not-to-say'; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const haptic = useHaptics();

  const [form, setForm] = useState({
    name: 'Aanya Sharma',
    email: 'aanya.sharma@example.com',
    phone: '9876543210',
    bio: 'Always hunting for the best deals and the cleanest design.',
    birthday: '1996-08-22',
    gender: 'female' as 'female' | 'male' | 'other' | 'prefer-not-to-say',
  });

  const handleSave = () => {
    haptic('success');
    Toast.show({ type: 'success', text1: 'Profile updated' });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Edit profile" subtitle="Personalize how ShopX greets you." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 220 }}>
        <LinearGradient
          colors={theme.palette.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarCard}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/200?u=shopx-elite' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[theme.typography.captionStrong, { color: '#FFFFFFAA' }]}>
              PROFILE PICTURE
            </Text>
            <Text style={[theme.typography.subtitle, { color: '#FFFFFF', marginTop: 2 }]}>
              Tap to update your avatar
            </Text>
          </View>
          <AnimatedTouchable
            hapticKind="selection"
            onPress={() => Toast.show({ type: 'info', text1: 'Open camera roll (mock)' })}
            style={styles.avatarBtn}
          >
            <Ionicons name="camera" size={18} color={theme.palette.primary} />
          </AnimatedTouchable>
        </LinearGradient>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Basics</Text>
          <Field
            label="Display name"
            placeholder="What should we call you?"
            icon="person"
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <Field
            label="Email"
            placeholder="you@example.com"
            icon="mail"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <Field
            label="Phone"
            placeholder="98765 43210"
            icon="call"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => setForm((f) => ({ ...f, phone: v.replace(/[^0-9]/g, '') }))}
            maxLength={10}
          />
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>About you</Text>
          <Field
            label="Short bio"
            placeholder="What do you love shopping for?"
            icon="bulb"
            value={form.bio}
            onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))}
            multiline
          />
          <Field
            label="Birthday"
            placeholder="YYYY-MM-DD"
            icon="gift"
            value={form.birthday}
            onChangeText={(v) => setForm((f) => ({ ...f, birthday: v }))}
          />
          <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted, marginTop: 14 }]}>
            GENDER
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {GENDERS.map((g) => (
              <FilterChip
                key={g.id}
                label={g.label}
                active={form.gender === g.id}
                onPress={() => setForm((f) => ({ ...f, gender: g.id }))}
              />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Verification
          </Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            <VerifyRow icon="mail-open" label="Email verified" verified />
            <VerifyRow icon="call" label="Phone verified" verified />
            <VerifyRow icon="logo-google" label="Connected Google account" verified={false} />
            <VerifyRow icon="logo-apple" label="Connected Apple ID" verified={false} />
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Privacy</Text>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 8 }]}>
            Choose what shows up in your public ShopX profile.
          </Text>
          <View style={{ marginTop: 12 }}>
            {[
              { label: 'Show real name', desc: 'Visible in reviews and Q&A', value: true },
              { label: 'Show profile picture', desc: 'Used on reviews and replies', value: true },
              { label: 'Show membership tier', desc: 'Adds a Gold badge to comments', value: false },
            ].map((row, idx) => (
              <View
                key={idx}
                style={[styles.privacyRow, { borderColor: theme.palette.divider }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]}>{row.label}</Text>
                  <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
                    {row.desc}
                  </Text>
                </View>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: row.value ? theme.palette.success : theme.palette.surfaceHigh },
                  ]}
                />
              </View>
            ))}
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
          title="Save changes"
          variant="primary"
          iconLeft="checkmark-circle"
          onPress={handleSave}
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
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  multiline?: boolean;
  maxLength?: number;
}> = ({ label, placeholder, icon, value, onChangeText, keyboardType = 'default', multiline, maxLength }) => {
  const theme = useTheme();
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[theme.typography.captionStrong, { color: theme.palette.textMuted }]}>
        {label}
      </Text>
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.palette.surfaceHigh,
            borderColor: theme.palette.border,
            alignItems: multiline ? 'flex-start' : 'center',
            height: multiline ? 96 : 48,
            paddingTop: multiline ? 12 : 0,
          },
        ]}
      >
        <Ionicons name={icon} size={16} color={theme.palette.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.palette.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          style={[
            styles.fieldInput,
            theme.typography.body,
            { color: theme.palette.text, textAlignVertical: multiline ? 'top' : 'center' },
          ]}
        />
      </View>
    </View>
  );
};

const VerifyRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  verified: boolean;
}> = ({ icon, label, verified }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.verifyRow,
        { borderColor: theme.palette.border },
      ]}
    >
      <View
        style={[
          styles.verifyIcon,
          { backgroundColor: verified ? theme.palette.successSoft : theme.palette.surfaceHigh },
        ]}
      >
        <Ionicons name={icon} size={16} color={verified ? theme.palette.success : theme.palette.textMuted} />
      </View>
      <Text style={[theme.typography.body, { color: theme.palette.text, flex: 1, marginLeft: 12 }]}>
        {label}
      </Text>
      <Text
        style={[
          theme.typography.captionStrong,
          { color: verified ? theme.palette.success : theme.palette.textMuted },
        ]}
      >
        {verified ? 'Verified' : 'Connect'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarCard: { padding: 18, borderRadius: 22, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#FFFFFFAA' },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 6,
    gap: 8,
  },
  fieldInput: { flex: 1, paddingVertical: 0 },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  verifyIcon: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
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
