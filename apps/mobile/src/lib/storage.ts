import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Tiny token store. Uses SecureStore on native; falls back to localStorage on web
 * (SecureStore is unavailable there).
 */
const memoryFallback = new Map<string, string>();

export const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      return memoryFallback.get(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      else memoryFallback.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      else memoryFallback.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const StorageKeys = {
  accessToken: 'fp.accessToken',
  refreshToken: 'fp.refreshToken',
} as const;
