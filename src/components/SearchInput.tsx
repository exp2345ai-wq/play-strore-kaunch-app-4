import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedTouchable } from './AnimatedTouchable';
import { useTheme } from '../theme/ThemeContext';

interface SearchInputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onPressFilter?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search ShopX universe…',
  onSubmit,
  onPressFilter,
  showFilter = true,
  autoFocus = false,
  style,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.palette.surfaceHigh,
          borderColor: theme.palette.border,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={18} color={theme.palette.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.palette.textMuted}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        style={[styles.input, theme.typography.body, { color: theme.palette.text }]}
      />
      {value.length > 0 ? (
        <AnimatedTouchable onPress={() => onChangeText('')} hapticKind="selection">
          <Ionicons name="close-circle" size={18} color={theme.palette.textMuted} />
        </AnimatedTouchable>
      ) : null}
      {showFilter ? (
        <AnimatedTouchable
          onPress={onPressFilter}
          hapticKind="selection"
          style={[styles.filter, { backgroundColor: theme.palette.primarySoft }]}
        >
          <Ionicons name="options" size={16} color={theme.palette.primary} />
        </AnimatedTouchable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  filter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
