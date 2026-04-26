import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types';

import { CartScreen } from '../screens/cart/CartScreen';
import { CartItemEditScreen } from '../screens/cart/CartItemEditScreen';
import { AddressSelectionScreen } from '../screens/cart/AddressSelectionScreen';
import { AddAddressFormScreen } from '../screens/cart/AddAddressFormScreen';
import { PaymentMethodScreen } from '../screens/cart/PaymentMethodScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();

export const CartStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: 'transparent' },
    }}
  >
    <Stack.Screen name="CartMain" component={CartScreen} />
    <Stack.Screen
      name="CartItemEdit"
      component={CartItemEditScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
    <Stack.Screen name="AddAddressForm" component={AddAddressFormScreen} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
  </Stack.Navigator>
);
