import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../store/CartContext';
import { useHaptics } from '../hooks/useHaptics';
import { RootTabParamList } from '../types';

import { HomeStackNavigator } from './HomeStack';
import { SearchStackNavigator } from './SearchStack';
import { CartStackNavigator } from './CartStack';
import { OrdersStackNavigator } from './OrdersStack';
import { ProfileStackNavigator } from './ProfileStack';
import { FloatingAIAssistant } from '../components/FloatingAIAssistant';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcon: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  SearchTab: 'search',
  CartTab: 'bag-handle',
  OrdersTab: 'cube',
  ProfileTab: 'person',
};

const tabIconOutline: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home-outline',
  SearchTab: 'search-outline',
  CartTab: 'bag-handle-outline',
  OrdersTab: 'cube-outline',
  ProfileTab: 'person-outline',
};

const tabLabel: Record<keyof RootTabParamList, string> = {
  HomeTab: 'Home',
  SearchTab: 'Search',
  CartTab: 'Cart',
  OrdersTab: 'Orders',
  ProfileTab: 'Profile',
};

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const haptic = useHaptics();
  const { count } = useCart();

  const navTheme = theme.mode === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.palette.background,
          card: theme.palette.surface,
          primary: theme.palette.primary,
          text: theme.palette.text,
          border: theme.palette.divider,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.palette.background,
          card: theme.palette.surface,
          primary: theme.palette.primary,
          text: theme.palette.text,
          border: theme.palette.divider,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenListeners={{
          tabPress: () => haptic('selection'),
        }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 16,
            height: 70,
            borderRadius: 26,
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            elevation: 8,
            shadowColor: theme.palette.shadow,
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 18,
          },
          tabBarBackground: () => (
            <View style={styles.tabBg}>
              <BlurView
                intensity={50}
                tint={theme.mode === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor:
                      theme.mode === 'dark'
                        ? 'rgba(20,27,48,0.55)'
                        : 'rgba(255,255,255,0.65)',
                    borderRadius: 26,
                    borderWidth: 1,
                    borderColor: theme.palette.border,
                  },
                ]}
              />
            </View>
          ),
          tabBarIcon: ({ focused, color }) => {
            const name = focused
              ? tabIcon[route.name as keyof RootTabParamList]
              : tabIconOutline[route.name as keyof RootTabParamList];
            const showBadge = route.name === 'CartTab' && count > 0;
            return (
              <View
                style={[
                  styles.iconWrap,
                  focused && {
                    backgroundColor: theme.palette.primarySoft,
                  },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    colors={theme.palette.gradientPrimary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeIndicator}
                  >
                    <Ionicons name={name} size={20} color={theme.palette.onPrimary} />
                  </LinearGradient>
                ) : (
                  <Ionicons name={name} size={22} color={color} />
                )}
                {showBadge ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.palette.accent, borderColor: theme.palette.background },
                    ]}
                  >
                    <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
                  </View>
                ) : null}
                {focused ? (
                  <Text
                    style={[
                      styles.label,
                      {
                        color: theme.palette.primary,
                      },
                    ]}
                  >
                    {tabLabel[route.name as keyof RootTabParamList]}
                  </Text>
                ) : null}
              </View>
            );
          },
          tabBarActiveTintColor: theme.palette.primary,
          tabBarInactiveTintColor: theme.palette.textMuted,
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
        <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
        <Tab.Screen name="CartTab" component={CartStackNavigator} />
        <Tab.Screen name="OrdersTab" component={OrdersStackNavigator} />
        <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
      </Tab.Navigator>
      <FloatingAIAssistant />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 26,
  },
  iconWrap: {
    width: 88,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  activeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.select({ ios: 6, android: 6, default: 6 }),
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 16,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
});
