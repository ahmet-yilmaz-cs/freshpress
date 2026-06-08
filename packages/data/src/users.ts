import type {
  CalorieDay,
  Device,
  JuiceHistoryEntry,
  Notification,
  User,
  WeeklyGoals,
} from '@freshpress/types';

/** A predefined user, including a (mock, plaintext) password for local auth. */
export interface MockUser extends User {
  password: string;
}

/** Everything that varies per user — keyed by user id in {@link userData}. */
export interface UserData {
  device: Device;
  history: JuiceHistoryEntry[];
  goals: WeeklyGoals;
  calories: { today: number; days: CalorieDay[] };
  notifications: Notification[];
}

export const users: MockUser[] = [
  {
    id: 'u-erdem',
    name: 'Erdem Yılmaz',
    email: 'erdem@freshpress.app',
    password: 'Password123',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    createdAt: '2024-09-01T08:00:00.000Z',
  },
  {
    id: 'u-demo',
    name: 'Demo User',
    email: 'demo@freshpress.app',
    password: 'Demo1234',
    avatarUrl: 'https://i.pravatar.cc/200?img=5',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'u-ahmet',
    name: 'Ahmet',
    email: 'ahmet@freshpress.app',
    password: 'Ahmet123',
    avatarUrl: 'https://i.pravatar.cc/200?img=33',
    createdAt: '2025-03-20T08:00:00.000Z',
  },
];

function device(overrides: Partial<Device>): Device {
  return {
    id: 'dev-juicelab',
    name: 'JuiceLab Pro X1',
    series: 'PREMIUM SERIES',
    connected: true,
    battery: 82,
    status: 'ready',
    speed: 'medium',
    yieldMl: 450,
    capacityPct: 75,
    ...overrides,
  };
}

/** Per-user mock data. The three predefined users are visibly distinct. */
export const userData: Record<string, UserData> = {
  'u-erdem': {
    device: device({ battery: 88, yieldMl: 480, capacityPct: 80, speed: 'high' }),
    goals: { count: 12, goal: 20, streakDays: 5 },
    calories: {
      today: 340,
      days: [
        { label: 'Mon', calories: 280 },
        { label: 'Tue', calories: 410 },
        { label: 'Wed', calories: 190 },
        { label: 'Thu', calories: 360 },
        { label: 'Fri', calories: 300 },
        { label: 'Sat', calories: 420 },
        { label: 'Sun', calories: 340 },
      ],
    },
    history: [
      {
        id: 'h-e1',
        title: 'Green Detox',
        volumeMl: 260,
        calories: 120,
        durationSec: 95,
        timestamp: '2026-06-08T07:30:00.000Z',
        group: 'TODAY',
        ingredients: ['Kale', 'Green apple', 'Cucumber'],
        quality: 'excellent',
      },
      {
        id: 'h-e2',
        title: 'Citrus Burst',
        volumeMl: 220,
        calories: 160,
        durationSec: 70,
        timestamp: '2026-06-08T12:10:00.000Z',
        group: 'TODAY',
        ingredients: ['Orange', 'Grapefruit', 'Carrot'],
        quality: 'good',
      },
      {
        id: 'h-e3',
        title: 'Beet Power',
        volumeMl: 300,
        calories: 140,
        durationSec: 100,
        timestamp: '2026-06-07T08:00:00.000Z',
        group: 'YESTERDAY',
        ingredients: ['Beetroot', 'Apple', 'Carrot', 'Ginger'],
        quality: 'excellent',
      },
    ],
    notifications: [
      {
        id: 'n-e1',
        title: 'Streak extended! 🔥',
        body: 'You hit 5 days in a row. Keep it fresh.',
        timestamp: '2026-06-08T07:35:00.000Z',
        read: false,
        kind: 'success',
      },
      {
        id: 'n-e2',
        title: 'Lemon running low',
        body: 'Only 2 lemons left in your hopper.',
        timestamp: '2026-06-07T19:00:00.000Z',
        read: false,
        kind: 'warning',
      },
      {
        id: 'n-e3',
        title: 'New recipe added',
        body: 'Try the Tropical Sunrise this week.',
        timestamp: '2026-06-06T10:00:00.000Z',
        read: true,
        kind: 'info',
      },
    ],
  },

  'u-demo': {
    device: device({ battery: 64, yieldMl: 320, capacityPct: 55, status: 'ready', speed: 'medium' }),
    goals: { count: 4, goal: 14, streakDays: 1 },
    calories: {
      today: 180,
      days: [
        { label: 'Mon', calories: 0 },
        { label: 'Tue', calories: 220 },
        { label: 'Wed', calories: 0 },
        { label: 'Thu', calories: 160 },
        { label: 'Fri', calories: 0 },
        { label: 'Sat', calories: 240 },
        { label: 'Sun', calories: 180 },
      ],
    },
    history: [
      {
        id: 'h-d1',
        title: 'Watermelon Mint',
        volumeMl: 200,
        calories: 110,
        durationSec: 60,
        timestamp: '2026-06-08T09:00:00.000Z',
        group: 'TODAY',
        ingredients: ['Watermelon', 'Mint', 'Lime'],
        quality: 'good',
      },
      {
        id: 'h-d2',
        title: 'Vitamin C Shot',
        volumeMl: 150,
        calories: 90,
        durationSec: 55,
        timestamp: '2026-06-06T08:30:00.000Z',
        group: 'THIS WEEK',
        ingredients: ['Orange', 'Lemon', 'Ginger'],
        quality: 'fair',
      },
    ],
    notifications: [
      {
        id: 'n-d1',
        title: 'Welcome to FreshPress 👋',
        body: 'Tap Start Juicing to make your first drink.',
        timestamp: '2026-06-08T08:00:00.000Z',
        read: false,
        kind: 'info',
      },
      {
        id: 'n-d2',
        title: 'Device connected',
        body: 'JuiceLab Pro X1 is paired and ready.',
        timestamp: '2026-06-07T18:00:00.000Z',
        read: true,
        kind: 'success',
      },
    ],
  },

  'u-ahmet': {
    device: device({ battery: 41, yieldMl: 540, capacityPct: 92, status: 'cleaning', speed: 'low' }),
    goals: { count: 19, goal: 20, streakDays: 11 },
    calories: {
      today: 520,
      days: [
        { label: 'Mon', calories: 480 },
        { label: 'Tue', calories: 510 },
        { label: 'Wed', calories: 460 },
        { label: 'Thu', calories: 530 },
        { label: 'Fri', calories: 500 },
        { label: 'Sat', calories: 470 },
        { label: 'Sun', calories: 520 },
      ],
    },
    history: [
      {
        id: 'h-a1',
        title: 'Berry Boost',
        volumeMl: 340,
        calories: 210,
        durationSec: 80,
        timestamp: '2026-06-08T06:45:00.000Z',
        group: 'TODAY',
        ingredients: ['Strawberry', 'Blueberry', 'Banana'],
        quality: 'excellent',
      },
      {
        id: 'h-a2',
        title: 'Tropical Sunrise',
        volumeMl: 300,
        calories: 190,
        durationSec: 85,
        timestamp: '2026-06-08T13:00:00.000Z',
        group: 'TODAY',
        ingredients: ['Pineapple', 'Mango', 'Coconut water'],
        quality: 'excellent',
      },
      {
        id: 'h-a3',
        title: 'Green Detox',
        volumeMl: 260,
        calories: 120,
        durationSec: 95,
        timestamp: '2026-06-07T07:00:00.000Z',
        group: 'YESTERDAY',
        ingredients: ['Kale', 'Green apple', 'Lemon'],
        quality: 'good',
      },
      {
        id: 'h-a4',
        title: 'Beet Power',
        volumeMl: 280,
        calories: 140,
        durationSec: 100,
        timestamp: '2026-06-05T07:30:00.000Z',
        group: 'THIS WEEK',
        ingredients: ['Beetroot', 'Apple', 'Ginger'],
        quality: 'good',
      },
    ],
    notifications: [
      {
        id: 'n-a1',
        title: 'Almost at your goal! 🎯',
        body: '1 more juice to hit 20 this week.',
        timestamp: '2026-06-08T13:05:00.000Z',
        read: false,
        kind: 'success',
      },
      {
        id: 'n-a2',
        title: 'Battery low',
        body: 'Charge your JuiceLab — 41% remaining.',
        timestamp: '2026-06-08T11:00:00.000Z',
        read: false,
        kind: 'warning',
      },
      {
        id: 'n-a3',
        title: 'Cleaning cycle done',
        body: 'Your juicer finished self-cleaning.',
        timestamp: '2026-06-07T22:00:00.000Z',
        read: true,
        kind: 'info',
      },
    ],
  },
};
