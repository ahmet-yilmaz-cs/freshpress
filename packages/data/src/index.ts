/**
 * @freshpress/data — on-device mock data + typed accessors.
 *
 * Drives the mobile app entirely from local data (no backend). Predefined users
 * have distinct per-user data; new users registered at runtime get a sensible
 * default dataset and live only for the session.
 */
import type {
  CalorieDay,
  Device,
  JuiceHistoryEntry,
  Notification,
  User,
  WeeklyGoals,
} from '@freshpress/types';

import { type MockUser, type UserData, userData, users } from './users';

export { recipes, programs, recommendations, stock } from './shared';
export type { MockUser, UserData };

/** Runtime (session-only) users created via register/appleSignIn. */
const runtimeUsers: MockUser[] = [];

function allUsers(): MockUser[] {
  return [...users, ...runtimeUsers];
}

/** Strip the password before handing a user to the app. */
function toUser(u: MockUser): User {
  const { password: _password, ...rest } = u;
  return rest;
}

export function findUserByEmail(email: string): MockUser | null {
  const target = email.trim().toLowerCase();
  return allUsers().find((u) => u.email.toLowerCase() === target) ?? null;
}

export function findUserById(id: string): MockUser | null {
  return allUsers().find((u) => u.id === id) ?? null;
}

/** Validate credentials. Returns the (password-stripped) user or null. */
export function authenticate(email: string, password: string): User | null {
  const u = findUserByEmail(email);
  if (!u || u.password !== password) return null;
  return toUser(u);
}

/** Public (password-stripped) view of a user. */
export function publicUser(u: MockUser): User {
  return toUser(u);
}

/** Create a session-only user and return its public view. */
export function createRuntimeUser(input: {
  name: string;
  email: string;
  password: string;
}): User {
  const user: MockUser = {
    id: `u-runtime-${runtimeUsers.length + 1}-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  runtimeUsers.push(user);
  userData[user.id] = defaultUserData();
  return toUser(user);
}

/** Default dataset for freshly registered users (empty-ish, ready to grow). */
function defaultUserData(): UserData {
  return {
    device: {
      id: 'dev-juicelab',
      name: 'JuiceLab Pro X1',
      series: 'PREMIUM SERIES',
      connected: false,
      battery: 100,
      status: 'offline',
      speed: 'medium',
      yieldMl: 0,
      capacityPct: 0,
    },
    goals: { count: 0, goal: 14, streakDays: 0 },
    calories: {
      today: 0,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => ({
        label,
        calories: 0,
      })),
    },
    history: [],
    notifications: [
      {
        id: 'n-new-1',
        title: 'Welcome to FreshPress 👋',
        body: 'Pair your juicer to get started.',
        timestamp: new Date().toISOString(),
        read: false,
        kind: 'info',
      },
    ],
  };
}

function dataFor(userId: string): UserData {
  return userData[userId] ?? defaultUserData();
}

export function getDevice(userId: string): Device {
  return dataFor(userId).device;
}

export function getHistory(userId: string): JuiceHistoryEntry[] {
  return dataFor(userId).history;
}

export function getGoals(userId: string): WeeklyGoals {
  return dataFor(userId).goals;
}

export function getCalories(userId: string): { today: number; days: CalorieDay[] } {
  return dataFor(userId).calories;
}

export function getNotifications(userId: string): Notification[] {
  return dataFor(userId).notifications;
}

/** Mutate device connection state (used by the pairing screen). */
export function setDeviceConnected(userId: string, connected: boolean): Device {
  const d = dataFor(userId).device;
  d.connected = connected;
  d.status = connected ? 'ready' : 'offline';
  return d;
}
