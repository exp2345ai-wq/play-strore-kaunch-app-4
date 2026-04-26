import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types';

import { SearchScreen } from '../screens/search/SearchScreen';
import { SearchResultsScreen } from '../screens/search/SearchResultsScreen';
import { SearchSuggestionResultsScreen } from '../screens/search/SearchSuggestionResultsScreen';
import { SearchFilterScreen } from '../screens/search/SearchFilterScreen';
import { SearchProductDetailScreen } from '../screens/search/SearchProductDetailScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: 'transparent' },
    }}
  >
    <Stack.Screen name="SearchMain" component={SearchScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    <Stack.Screen
      name="SearchSuggestionResults"
      component={SearchSuggestionResultsScreen}
    />
    <Stack.Screen
      name="SearchFilter"
      component={SearchFilterScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name="SearchProductDetail" component={SearchProductDetailScreen} />
  </Stack.Navigator>
);
