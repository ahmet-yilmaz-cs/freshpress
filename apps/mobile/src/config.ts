import Constants from 'expo-constants';

/**
 * API base URL resolution order:
 *  1. EXPO_PUBLIC_API_URL (build-time / .env)
 *  2. app.json `extra.apiUrl`
 *  3. localhost dev default
 */
const fromExtra = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? fromExtra ?? 'http://localhost:5050';
