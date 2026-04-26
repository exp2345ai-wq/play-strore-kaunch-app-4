import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  cart: '@shopx/cart',
  wishlist: '@shopx/wishlist',
  savedForLater: '@shopx/saved-for-later',
  settings: '@shopx/settings',
  recentSearches: '@shopx/recent-searches',
  history: '@shopx/history',
  addresses: '@shopx/addresses',
  paymentMethods: '@shopx/payment-methods',
  aiChat: '@shopx/ai-chat',
  notifications: '@shopx/notifications',
  profile: '@shopx/profile',
};

export const readJSON = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeJSON = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail; offline-first storage layer.
  }
};

export const removeKey = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(storageKeys));
  } catch {
    // ignore
  }
};
