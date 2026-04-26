import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Address } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { AnimatedTouchable } from './AnimatedTouchable';
import { formatPincode } from '../utils/format';

interface AddressCardProps {
  address: Address;
  onPress?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;
  selected?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onPress,
  onPressEdit,
  onPressDelete,
  selected = false,
}) => {
  const theme = useTheme();
  return (
    <AnimatedTouchable
      onPress={onPress}
      hapticKind="selection"
      style={[
        styles.card,
        {
          backgroundColor: theme.palette.surface,
          borderColor: selected ? theme.palette.primary : theme.palette.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.typePill,
            { backgroundColor: theme.palette.primarySoft },
          ]}
        >
          <Ionicons
            name={address.type === 'home' ? 'home' : address.type === 'work' ? 'briefcase' : 'pin'}
            size={12}
            color={theme.palette.primary}
          />
          <Text style={[theme.typography.micro, { color: theme.palette.primary, marginLeft: 4 }]}>
            {address.type.toUpperCase()}
          </Text>
        </View>
        {address.isDefault ? (
          <View style={[styles.defaultPill, { backgroundColor: theme.palette.successSoft }]}>
            <Ionicons name="checkmark-circle" size={12} color={theme.palette.success} />
            <Text style={[theme.typography.micro, { color: theme.palette.success, marginLeft: 4 }]}>
              Default
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 8 }]}>
        {address.fullName}
      </Text>
      <Text style={[theme.typography.body, { color: theme.palette.textSecondary, marginTop: 4 }]}>
        {address.flat}, {address.area}
      </Text>
      {address.landmark ? (
        <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 2 }]}>
          Landmark: {address.landmark}
        </Text>
      ) : null}
      <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 4 }]}>
        {address.city}, {address.state} – {formatPincode(address.pincode)}
      </Text>
      <Text style={[theme.typography.captionStrong, { color: theme.palette.text, marginTop: 8 }]}>
        {address.phone}
      </Text>

      {onPressEdit || onPressDelete ? (
        <View style={styles.actionRow}>
          {onPressEdit ? (
            <AnimatedTouchable onPress={onPressEdit} hapticKind="light" style={styles.actionBtn}>
              <Ionicons name="create-outline" size={14} color={theme.palette.primary} />
              <Text
                style={[
                  theme.typography.captionStrong,
                  { color: theme.palette.primary, marginLeft: 6 },
                ]}
              >
                Edit
              </Text>
            </AnimatedTouchable>
          ) : null}
          {onPressDelete ? (
            <AnimatedTouchable onPress={onPressDelete} hapticKind="warning" style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={14} color={theme.palette.danger} />
              <Text
                style={[
                  theme.typography.captionStrong,
                  { color: theme.palette.danger, marginLeft: 6 },
                ]}
              >
                Delete
              </Text>
            </AnimatedTouchable>
          ) : null}
        </View>
      ) : null}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  defaultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  actionRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
});
