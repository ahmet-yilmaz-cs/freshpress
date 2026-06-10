import type {
  CalorieDay,
  Device,
  DeviceDetails,
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
  deviceDetails: DeviceDetails;
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
    createdAt: '2024-09-01T08:00:00.000Z',
  },
  {
    id: 'u-demo',
    name: 'Demo Kullanıcı',
    email: 'demo@freshpress.app',
    password: 'Demo1234',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'u-ahmet',
    name: 'Ahmet',
    email: 'ahmet@freshpress.app',
    password: 'Ahmet123',
    createdAt: '2025-03-20T08:00:00.000Z',
  },
];

function device(overrides: Partial<Device>): Device {
  return {
    id: 'dev-juicelab',
    name: 'JuiceLab Pro X1',
    series: 'PREMIUM SERİ',
    connected: true,
    battery: 82,
    status: 'ready',
    speed: 'medium',
    yieldMl: 450,
    capacityPct: 75,
    ...overrides,
  };
}

function details(overrides: Partial<DeviceDetails>): DeviceDetails {
  return {
    model: 'JLX1-2026',
    serialNumber: 'FP-7741-029',
    firmwareVersion: 'v2.5.1',
    bluetoothVersion: '5.2',
    totalRuntimeMin: 2842,
    totalJuices: 214,
    filterUses: 38,
    filterLimit: 50,
    nextMaintenanceDays: 14,
    motorHealth: 'normal',
    lastSyncAt: '2026-06-10T09:14:00.000Z',
    ...overrides,
  };
}

const WEEK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] as const;
const day = (i: number, calories: number): CalorieDay => ({ label: WEEK[i] ?? '', calories });

/** Per-user mock data. The three predefined users are visibly distinct. */
export const userData: Record<string, UserData> = {
  'u-erdem': {
    device: device({ battery: 88, yieldMl: 480, capacityPct: 80, speed: 'high' }),
    deviceDetails: details({
      totalRuntimeMin: 3120,
      totalJuices: 246,
      filterUses: 32,
      nextMaintenanceDays: 18,
      lastSyncAt: '2026-06-10T09:14:00.000Z',
    }),
    goals: { count: 12, goal: 20, streakDays: 5 },
    calories: {
      today: 340,
      days: [day(0, 280), day(1, 410), day(2, 190), day(3, 360), day(4, 300), day(5, 420), day(6, 340)],
    },
    history: [
      {
        id: 'h-e1',
        recipeId: 'r-green-detox',
        title: 'Yeşil Detoks',
        volumeMl: 260,
        calories: 120,
        durationSec: 95,
        timestamp: '2026-06-08T07:30:00.000Z',
        group: 'BUGÜN',
        ingredients: ['Karalahana', 'Yeşil elma', 'Salatalık'],
        quality: 'excellent',
      },
      {
        id: 'h-e2',
        recipeId: 'r-citrus-burst',
        title: 'Narenciye Patlaması',
        volumeMl: 220,
        calories: 160,
        durationSec: 70,
        timestamp: '2026-06-08T12:10:00.000Z',
        group: 'BUGÜN',
        ingredients: ['Portakal', 'Greyfurt', 'Havuç'],
        quality: 'good',
      },
      {
        id: 'h-e3',
        recipeId: 'r-beet-power',
        title: 'Pancar Gücü',
        volumeMl: 300,
        calories: 140,
        durationSec: 100,
        timestamp: '2026-06-07T08:00:00.000Z',
        group: 'DÜN',
        ingredients: ['Pancar', 'Elma', 'Havuç', 'Zencefil'],
        quality: 'excellent',
      },
    ],
    notifications: [
      {
        id: 'n-e1',
        title: 'Seri uzadı! 🔥',
        body: 'Üst üste 5 güne ulaştın. Taze kalmaya devam et.',
        timestamp: '2026-06-08T07:35:00.000Z',
        read: false,
        kind: 'success',
      },
      {
        id: 'n-e2',
        title: 'Limon azalıyor',
        body: 'Haznende sadece 2 limon kaldı.',
        timestamp: '2026-06-07T19:00:00.000Z',
        read: false,
        kind: 'warning',
      },
      {
        id: 'n-e3',
        title: 'Yeni tarif eklendi',
        body: 'Bu hafta Tropik Gün Doğumu’nu dene.',
        timestamp: '2026-06-06T10:00:00.000Z',
        read: true,
        kind: 'info',
      },
    ],
  },

  'u-demo': {
    device: device({
      battery: 64,
      yieldMl: 320,
      capacityPct: 55,
      status: 'ready',
      speed: 'medium',
    }),
    deviceDetails: details({
      serialNumber: 'FP-DEMO-117',
      totalRuntimeMin: 620,
      totalJuices: 48,
      filterUses: 12,
      nextMaintenanceDays: 30,
      lastSyncAt: '2026-06-10T08:02:00.000Z',
    }),
    goals: { count: 4, goal: 14, streakDays: 1 },
    calories: {
      today: 180,
      days: [day(0, 0), day(1, 220), day(2, 0), day(3, 160), day(4, 0), day(5, 240), day(6, 180)],
    },
    history: [
      {
        id: 'h-d1',
        recipeId: 'r-watermelon-mint',
        title: 'Karpuz Nane',
        volumeMl: 200,
        calories: 110,
        durationSec: 60,
        timestamp: '2026-06-08T09:00:00.000Z',
        group: 'BUGÜN',
        ingredients: ['Karpuz', 'Nane', 'Misket limonu'],
        quality: 'good',
      },
      {
        id: 'h-d2',
        recipeId: 'r-vitamin-c',
        title: 'C Vitamini Shot',
        volumeMl: 150,
        calories: 90,
        durationSec: 55,
        timestamp: '2026-06-06T08:30:00.000Z',
        group: 'BU HAFTA',
        ingredients: ['Portakal', 'Limon', 'Zencefil'],
        quality: 'fair',
      },
    ],
    notifications: [
      {
        id: 'n-d1',
        title: 'FreshPress’e hoş geldin 👋',
        body: 'İlk içeceğini yapmak için Sıkmaya Başla’ya dokun.',
        timestamp: '2026-06-08T08:00:00.000Z',
        read: false,
        kind: 'info',
      },
      {
        id: 'n-d2',
        title: 'Cihaz bağlandı',
        body: 'JuiceLab Pro X1 eşlendi ve hazır.',
        timestamp: '2026-06-07T18:00:00.000Z',
        read: true,
        kind: 'success',
      },
    ],
  },

  'u-ahmet': {
    device: device({
      battery: 41,
      yieldMl: 540,
      capacityPct: 92,
      status: 'cleaning',
      speed: 'low',
    }),
    deviceDetails: details({
      serialNumber: 'FP-AHM-884',
      totalRuntimeMin: 5170,
      totalJuices: 392,
      filterUses: 45,
      nextMaintenanceDays: 5,
      motorHealth: 'service-soon',
      lastSyncAt: '2026-06-10T07:48:00.000Z',
    }),
    goals: { count: 19, goal: 20, streakDays: 11 },
    calories: {
      today: 520,
      days: [day(0, 480), day(1, 510), day(2, 460), day(3, 530), day(4, 500), day(5, 470), day(6, 520)],
    },
    history: [
      {
        id: 'h-a1',
        recipeId: 'r-berry-boost',
        title: 'Meyve Şöleni',
        volumeMl: 340,
        calories: 210,
        durationSec: 80,
        timestamp: '2026-06-08T06:45:00.000Z',
        group: 'BUGÜN',
        ingredients: ['Çilek', 'Yaban mersini', 'Muz'],
        quality: 'excellent',
      },
      {
        id: 'h-a2',
        recipeId: 'r-tropical-sunrise',
        title: 'Tropik Gün Doğumu',
        volumeMl: 300,
        calories: 190,
        durationSec: 85,
        timestamp: '2026-06-08T13:00:00.000Z',
        group: 'BUGÜN',
        ingredients: ['Ananas', 'Mango', 'Hindistan cevizi suyu'],
        quality: 'excellent',
      },
      {
        id: 'h-a3',
        recipeId: 'r-green-detox',
        title: 'Yeşil Detoks',
        volumeMl: 260,
        calories: 120,
        durationSec: 95,
        timestamp: '2026-06-07T07:00:00.000Z',
        group: 'DÜN',
        ingredients: ['Karalahana', 'Yeşil elma', 'Limon'],
        quality: 'good',
      },
      {
        id: 'h-a4',
        recipeId: 'r-beet-power',
        title: 'Pancar Gücü',
        volumeMl: 280,
        calories: 140,
        durationSec: 100,
        timestamp: '2026-06-05T07:30:00.000Z',
        group: 'BU HAFTA',
        ingredients: ['Pancar', 'Elma', 'Zencefil'],
        quality: 'good',
      },
    ],
    notifications: [
      {
        id: 'n-a1',
        title: 'Hedefe çok az kaldı! 🎯',
        body: 'Bu hafta 20’ye ulaşmak için 1 sıkım daha.',
        timestamp: '2026-06-08T13:05:00.000Z',
        read: false,
        kind: 'success',
      },
      {
        id: 'n-a2',
        title: 'Pil düşük',
        body: 'JuiceLab’ı şarj et — %41 kaldı.',
        timestamp: '2026-06-08T11:00:00.000Z',
        read: false,
        kind: 'warning',
      },
      {
        id: 'n-a3',
        title: 'Temizlik tamamlandı',
        body: 'Makinen kendi kendini temizledi.',
        timestamp: '2026-06-07T22:00:00.000Z',
        read: true,
        kind: 'info',
      },
    ],
  },
};
