import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../types';
import { useTheme, useThemeControl } from '../../theme/ThemeContext';
import { useSettings } from '../../store/SettingsContext';
import { useAddresses } from '../../store/AddressContext';
import { useWishlist } from '../../store/WishlistContext';
import { useHaptics } from '../../hooks/useHaptics';

import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { FilterChip } from '../../components/FilterChip';

import { initialOrders } from '../../data/orders';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

const ACCENTS: { id: 'indigo' | 'cyan' | 'magenta' | 'lime' | 'amber' | 'rose'; color: string }[] = [
  { id: 'indigo', color: '#6366F1' },
  { id: 'cyan', color: '#06B6D4' },
  { id: 'magenta', color: '#D946EF' },
  { id: 'lime', color: '#A3E635' },
  { id: 'amber', color: '#F59E0B' },
  { id: 'rose', color: '#F43F5E' },
];

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const themeControl = useThemeControl();
  const haptic = useHaptics();
  const { settings, update } = useSettings();
  const { addresses } = useAddresses();
  const { entries: wishlist } = useWishlist();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const handleToggleColor = useCallback(() => {
    haptic('selection');
    themeControl.setColorMode(theme.mode === 'dark' ? 'light' : 'dark');
  }, [haptic, theme.mode, themeControl]);

  return (
    <ScreenContainer
      scroll
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentStyle={{ paddingBottom: 200 }}
    >
      <ScreenHeader title="You" subtitle="Account, addresses, payments & more." showBack={false} />

      <View style={{ paddingHorizontal: 16 }}>
        <LinearGradient
          colors={theme.palette.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/200?u=shopx-elite' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[theme.typography.captionStrong, { color: '#FFFFFFAA' }]}>
                GOLD MEMBER · since 2024
              </Text>
              <Text style={[theme.typography.h2, { color: '#FFFFFF', marginTop: 2 }]}>
                Aanya Sharma
              </Text>
              <Text style={[theme.typography.caption, { color: '#FFFFFFAA', marginTop: 2 }]}>
                aanya.sharma@example.com
              </Text>
            </View>
            <AnimatedTouchable
              hapticKind="light"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editBtn}
            >
              <Ionicons name="pencil" size={14} color={theme.palette.primary} />
            </AnimatedTouchable>
          </View>

          <View style={styles.statsRow}>
            <Stat label="Orders" value={`${initialOrders.length}`} />
            <View style={styles.statSep} />
            <Stat label="Wishlist" value={`${wishlist.length}`} />
            <View style={styles.statSep} />
            <Stat label="Reward pts" value="2,340" />
          </View>
        </LinearGradient>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {SHORTCUTS(navigation).map((sc) => (
            <AnimatedTouchable
              key={sc.id}
              hapticKind="light"
              onPress={sc.onPress}
              style={[styles.shortcut, { backgroundColor: theme.palette.surface, borderColor: theme.palette.border }]}
            >
              <View style={[styles.shortcutIcon, { backgroundColor: theme.palette.primarySoft }]}>
                <Ionicons name={sc.icon} size={20} color={theme.palette.primary} />
              </View>
              <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginTop: 8 }]}>
                {sc.label}
              </Text>
            </AnimatedTouchable>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Preferences</Text>
          <SettingRow
            icon={theme.mode === 'dark' ? 'moon' : 'sunny'}
            label={`${theme.mode === 'dark' ? 'Dark' : 'Light'} mode`}
            description="Tap to switch the entire app"
            right={
              <Switch
                value={theme.mode === 'dark'}
                onValueChange={handleToggleColor}
                trackColor={{ false: theme.palette.surfaceHigh, true: theme.palette.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="phone-portrait"
            label="Haptics"
            description="Subtle tap feedback on every action"
            right={
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(v) => update({ hapticsEnabled: v })}
                trackColor={{ false: theme.palette.surfaceHigh, true: theme.palette.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="notifications"
            label="Push notifications"
            description="Order updates, deals and price drops"
            right={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(v) => update({ notificationsEnabled: v })}
                trackColor={{ false: theme.palette.surfaceHigh, true: theme.palette.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingRow
            icon="speedometer"
            label="Reduce motion"
            description="Calmer animations across the app"
            right={
              <Switch
                value={settings.reduceMotion}
                onValueChange={(v) => update({ reduceMotion: v })}
                trackColor={{ false: theme.palette.surfaceHigh, true: theme.palette.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </GlassCard>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Accent color</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            {ACCENTS.map((a) => (
              <AnimatedTouchable
                key={a.id}
                hapticKind="selection"
                onPress={() => update({ accentColor: a.id })}
                style={[
                  styles.accent,
                  {
                    backgroundColor: a.color,
                    borderColor: settings.accentColor === a.id ? theme.palette.text : theme.palette.border,
                    borderWidth: settings.accentColor === a.id ? 3 : 1,
                  },
                ]}
              >
                <View />
              </AnimatedTouchable>
            ))}
          </View>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 12 }]}>
            Accent applies to call-to-action buttons and highlight cards.
          </Text>
        </GlassCard>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Account</Text>
          <RowLink
            icon="location"
            label={`Saved addresses (${addresses.length})`}
            description="Home, work, and other delivery spots"
            onPress={() => navigation.navigate('AddressList')}
          />
          <RowLink
            icon="card"
            label="Payment methods"
            description="UPI, cards, wallets, COD"
            onPress={() => {}}
          />
          <RowLink
            icon="gift"
            label="Reward points & coupons"
            description="2,340 pts · 4 active coupons"
            onPress={() => {}}
          />
          <RowLink
            icon="shield-checkmark"
            label="Privacy & security"
            description="Two-factor, sessions, blocked sellers"
            onPress={() => {}}
          />
          <RowLink
            icon="language"
            label="Language"
            description="English (India)"
            onPress={() => {}}
          />
          <RowLink
            icon="help-buoy"
            label="Help center"
            description="Returns, refunds, FAQs"
            onPress={() => {}}
          />
          <RowLink
            icon="log-out"
            label="Sign out"
            description="See you again soon"
            danger
            onPress={() => {}}
          />
        </GlassCard>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <GlassCard>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Currency</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {(['INR', 'USD', 'EUR', 'GBP'] as const).map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={settings.currency === c}
                onPress={() => update({ currency: c })}
              />
            ))}
          </View>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 12 }]}>
            Prices and totals across the app reflect your selected currency.
          </Text>
        </GlassCard>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 80 }}>
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, textAlign: 'center' }]}>
          ShopX Elite Pro Max · v2.4.1 · Made with ♥ in India
        </Text>
      </View>
    </ScreenContainer>
  );
};

const SHORTCUTS = (navigation: Props['navigation']) => [
  { id: 'orders', label: 'My orders', icon: 'cube' as const, onPress: () => {} },
  { id: 'wishlist', label: 'Wishlist', icon: 'heart' as const, onPress: () => {} },
  { id: 'addresses', label: 'Addresses', icon: 'location' as const, onPress: () => navigation.navigate('AddressList') },
  { id: 'edit', label: 'Edit profile', icon: 'create' as const, onPress: () => navigation.navigate('EditProfile') },
];

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[theme.typography.h3, { color: '#FFFFFF' }]}>{value}</Text>
      <Text style={[theme.typography.captionStrong, { color: '#FFFFFFAA', marginTop: 2 }]}>{label}</Text>
    </View>
  );
};

const SettingRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  right: React.ReactNode;
}> = ({ icon, label, description, right }) => {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderColor: theme.palette.divider }]}>
      <View style={[styles.rowIcon, { backgroundColor: theme.palette.primarySoft }]}>
        <Ionicons name={icon} size={16} color={theme.palette.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[theme.typography.bodyStrong, { color: theme.palette.text }]}>{label}</Text>
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
          {description}
        </Text>
      </View>
      {right}
    </View>
  );
};

const RowLink: React.FC<{
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
      style={[styles.row, { borderColor: theme.palette.divider }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${tint}22` }]}>
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[theme.typography.bodyStrong, { color: danger ? theme.palette.danger : theme.palette.text }]}>
          {label}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.palette.textMuted} />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  heroCard: { padding: 18, borderRadius: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#FFFFFFAA' },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFFEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF22',
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  statSep: { width: StyleSheet.hairlineWidth, backgroundColor: '#FFFFFFAA', marginHorizontal: 6 },
  shortcut: {
    width: '47%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    flexGrow: 1,
  },
  shortcutIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  accent: { width: 36, height: 36, borderRadius: 18 },
});
