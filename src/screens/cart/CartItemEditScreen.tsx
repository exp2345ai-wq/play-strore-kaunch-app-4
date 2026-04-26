import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CartStackParamList } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { useHaptics } from '../../hooks/useHaptics';

import { findProduct } from '../../data/products';

import { ScreenHeader } from '../../components/ScreenHeader';
import { GlassCard } from '../../components/GlassCard';
import { PrimaryButton } from '../../components/PrimaryButton';
import { QuantitySelector } from '../../components/QuantitySelector';
import { AnimatedTouchable } from '../../components/AnimatedTouchable';
import { FilterChip } from '../../components/FilterChip';

import { formatMoney } from '../../utils/format';
import { multiplyMoney } from '../../utils/helpers';

type Props = NativeStackScreenProps<CartStackParamList, 'CartItemEdit'>;

export const CartItemEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { items, updateQuantity, remove } = useCart();
  const { add: addWishlist } = useWishlist();

  const item = items.find((i) => i.id === route.params.itemId);
  const product = item ? findProduct(item.productId) : undefined;
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [reason, setReason] = useState<string | null>(null);

  if (!item || !product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
        <ScreenHeader title="Item" />
        <Text style={[theme.typography.body, { color: theme.palette.text, padding: 24 }]}>
          We couldn't find this cart item.
        </Text>
      </View>
    );
  }

  const handleSave = () => {
    haptic('success');
    updateQuantity(item.id, quantity);
    navigation.goBack();
  };

  const handleMoveToWishlist = () => {
    haptic('selection');
    addWishlist(item.productId);
    remove(item.id);
    navigation.goBack();
  };

  const handleRemove = () => {
    haptic('warning');
    remove(item.id);
    navigation.goBack();
  };

  const total = multiplyMoney(item.unitPrice, quantity);

  return (
    <View style={[styles.container, { backgroundColor: theme.palette.background }]}>
      <ScreenHeader title="Edit cart item" subtitle="Adjust quantity, save, or remove." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.palette.surface, borderColor: theme.palette.border },
          ]}
        >
          <Image source={{ uri: product.thumbnail }} style={styles.heroImage} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[theme.typography.captionStrong, { color: theme.palette.primary }]}>
              {product.brand.toUpperCase()}
            </Text>
            <Text style={[theme.typography.subtitle, { color: theme.palette.text, marginTop: 4 }]} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={[theme.typography.h3, { color: theme.palette.text, marginTop: 8 }]}>
              {formatMoney(item.unitPrice)} each
            </Text>
          </View>
        </View>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Quantity</Text>
          <View style={styles.qtyRow}>
            <Text style={[theme.typography.body, { color: theme.palette.textMuted }]}>
              How many to keep?
            </Text>
            <QuantitySelector value={quantity} onChange={setQuantity} max={20} />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.palette.divider }]} />
          <View style={styles.totalRow}>
            <Text style={[theme.typography.body, { color: theme.palette.textSecondary }]}>
              Updated total
            </Text>
            <Text style={[theme.typography.h2, { color: theme.palette.text }]}>
              {formatMoney(total)}
            </Text>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>
            Why are you adjusting?
          </Text>
          <View style={styles.reasonWrap}>
            {[
              'Bought too many',
              'Found cheaper elsewhere',
              'Want a different variant',
              'Order is too pricey',
              'Just exploring',
            ].map((r) => (
              <FilterChip
                key={r}
                label={r}
                active={reason === r}
                onPress={() => setReason(r)}
              />
            ))}
          </View>
          <Text style={[theme.typography.caption, { color: theme.palette.textMuted, marginTop: 12 }]}>
            Optional · helps our team curate better deals for you. We never share this with sellers.
          </Text>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[theme.typography.subtitle, { color: theme.palette.text }]}>Quick actions</Text>
          <View style={{ marginTop: 12 }}>
            <ActionRow
              icon="heart"
              label="Move to wishlist"
              description="Save it for later, decide closer to delivery"
              onPress={handleMoveToWishlist}
            />
            <ActionRow
              icon="bookmark"
              label="Save for later"
              description="Tucks it under the saved tab"
              onPress={() => {
                haptic('selection');
                navigation.goBack();
              }}
            />
            <ActionRow
              icon="trash"
              label="Remove from cart"
              description="Frees up the spot in your bag"
              danger
              onPress={handleRemove}
            />
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
      hapticKind={danger ? 'warning' : 'selection'}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  heroImage: { width: 86, height: 86, borderRadius: 14 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reasonWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
