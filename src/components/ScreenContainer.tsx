import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, RefreshControl, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeContext';
import { GradientBackground } from './GradientBackground';

interface ScreenContainerProps extends Omit<ScrollViewProps, 'refreshControl'> {
  children?: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: ViewStyle | ViewStyle[];
  withGradient?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scroll = true,
  edges = ['top'],
  refreshing,
  onRefresh,
  contentStyle,
  withGradient = false,
  ...rest
}) => {
  const theme = useTheme();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={theme.palette.primary}
            progressBackgroundColor={theme.palette.surface}
            colors={[theme.palette.primary, theme.palette.accent]}
          />
        ) : undefined
      }
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: theme.palette.background }]}
    >
      {withGradient ? (
        <GradientBackground preset="cardSoft" style={StyleSheet.absoluteFill} />
      ) : null}
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 120 },
});
