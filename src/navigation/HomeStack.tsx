import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

import { HomeScreen } from '../screens/home/HomeScreen';
import { CategoryProductsScreen } from '../screens/home/CategoryProductsScreen';
import { ProductDetailScreen } from '../screens/home/ProductDetailScreen';
import { VariantSelectionScreen } from '../screens/home/VariantSelectionScreen';
import { CartReviewScreen } from '../screens/home/CartReviewScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: 'transparent' },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen
      name="VariantSelection"
      component={VariantSelectionScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name="CartReview" component={CartReviewScreen} />
  </Stack.Navigator>
);
