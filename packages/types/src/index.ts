/** Shared domain types for FreshPress (consumed by mobile app + reflects API contract). */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/** Smart juicer device state (mirrors the Device Control screen). */
export interface Device {
  id: string;
  name: string; // "JuiceLab Pro X1"
  series: string; // "PREMIUM SERIES"
  connected: boolean;
  battery: number; // 0-100
  status: DeviceStatus;
  speed: ExtractionSpeed;
  yieldMl: number;
  capacityPct: number; // 0-100
}

export type DeviceStatus = 'ready' | 'juicing' | 'paused' | 'cleaning' | 'offline';
export type ExtractionSpeed = 'low' | 'medium' | 'high';

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  calories: number;
  durationSec: number;
  ingredients: string[];
}

/** A logged juice the user has made. */
export interface JuiceHistoryEntry {
  id: string;
  title: string;
  volumeMl: number;
  calories: number;
  durationSec: number;
  timestamp: string; // ISO
  group: string; // relative bucket, e.g. "TODAY" | "YESTERDAY" | "THIS WEEK"
  ingredients: string[];
  quality: 'excellent' | 'good' | 'fair';
}

/** Weekly juicing goal progress. */
export interface WeeklyGoals {
  count: number;
  goal: number;
  streakDays: number;
}

/** A single day's calorie bucket for the calorie counter. */
export interface CalorieDay {
  label: string; // "Mon", "Tue", ...
  calories: number;
}

/** A preset juicing program available on the device. */
export interface JuiceProgram {
  id: string;
  name: string;
  volumeMl: number;
  durationSec: number;
  color: string; // hex accent
}

/** An in-app notification. */
export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string; // ISO
  read: boolean;
  kind: 'info' | 'success' | 'warning';
}

/** A stocked ingredient and its remaining level. */
export interface StockItem {
  id: string;
  name: string;
  level: number; // 0-100 remaining
  unit: string; // "g" | "ml" | "pcs"
  amount: number; // remaining amount in unit
}

/** A curated recommendation card. */
export interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  recipeId?: string;
}

/** Standard API error envelope returned by the Flask backend. */
export interface ApiError {
  error: string;
  message: string;
  fields?: Record<string, string>;
}
