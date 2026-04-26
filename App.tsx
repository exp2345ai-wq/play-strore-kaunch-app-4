import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { SettingsProvider } from './src/store/SettingsContext';
import { CartProvider } from './src/store/CartContext';
import { WishlistProvider } from './src/store/WishlistContext';
import { HistoryProvider } from './src/store/HistoryContext';
import { AddressProvider } from './src/store/AddressContext';
import { AIChatProvider } from './src/store/AIChatContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastHost } from './src/components/ToastHost';

const ThemedStatusBar: React.FC = () => {
  const theme = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <HistoryProvider>
                  <AddressProvider>
                    <AIChatProvider>
                      <BottomSheetModalProvider>
                        <View style={styles.flex}>
                          <ThemedStatusBar />
                          <RootNavigator />
                          <ToastHost />
                        </View>
                      </BottomSheetModalProvider>
                    </AIChatProvider>
                  </AddressProvider>
                </HistoryProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
