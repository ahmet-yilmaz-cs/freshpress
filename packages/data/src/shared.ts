import type {
  JuiceProgram,
  Recipe,
  Recommendation,
  StockItem,
} from '@freshpress/types';

/** Curated recipe catalog (shared across all users). Images from Unsplash. */
export const recipes: Recipe[] = [
  {
    id: 'r-green-detox',
    title: 'Green Detox',
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600',
    calories: 120,
    durationSec: 95,
    ingredients: ['Kale', 'Green apple', 'Cucumber', 'Lemon', 'Ginger'],
  },
  {
    id: 'r-citrus-burst',
    title: 'Citrus Burst',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600',
    calories: 160,
    durationSec: 70,
    ingredients: ['Orange', 'Grapefruit', 'Carrot', 'Turmeric'],
  },
  {
    id: 'r-berry-boost',
    title: 'Berry Boost',
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600',
    calories: 210,
    durationSec: 80,
    ingredients: ['Strawberry', 'Blueberry', 'Banana', 'Almond milk'],
  },
  {
    id: 'r-tropical-sunrise',
    title: 'Tropical Sunrise',
    imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600',
    calories: 190,
    durationSec: 85,
    ingredients: ['Pineapple', 'Mango', 'Coconut water', 'Lime'],
  },
  {
    id: 'r-beet-power',
    title: 'Beet Power',
    imageUrl: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600',
    calories: 140,
    durationSec: 100,
    ingredients: ['Beetroot', 'Apple', 'Carrot', 'Ginger'],
  },
  {
    id: 'r-vitamin-c',
    title: 'Vitamin C Shot',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600',
    calories: 90,
    durationSec: 55,
    ingredients: ['Orange', 'Lemon', 'Ginger', 'Cayenne'],
  },
  {
    id: 'r-watermelon-mint',
    title: 'Watermelon Mint',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    calories: 110,
    durationSec: 60,
    ingredients: ['Watermelon', 'Mint', 'Lime'],
  },
];

/** Preset device programs (shared). */
export const programs: JuiceProgram[] = [
  { id: 'p-morning', name: 'Morning Smoothie', volumeMl: 240, durationSec: 90, color: '#ff8200' },
  { id: 'p-mid-detox', name: 'Mid Detox', volumeMl: 180, durationSec: 75, color: '#91f68d' },
  { id: 'p-evening', name: 'Evening Detox', volumeMl: 300, durationSec: 110, color: '#954a00' },
  { id: 'p-green', name: 'Green Detox', volumeMl: 260, durationSec: 100, color: '#00721e' },
  { id: 'p-vitamin-c', name: 'Vitamin C', volumeMl: 150, durationSec: 55, color: '#fbbf24' },
];

/** Curated recommendations (shared). */
export const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Start your day fresh',
    subtitle: 'Green Detox keeps you light and focused.',
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600',
    recipeId: 'r-green-detox',
  },
  {
    id: 'rec-2',
    title: 'Beat the afternoon slump',
    subtitle: 'A Citrus Burst for a natural energy lift.',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600',
    recipeId: 'r-citrus-burst',
  },
  {
    id: 'rec-3',
    title: 'Recover after a workout',
    subtitle: 'Berry Boost replenishes and rebuilds.',
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600',
    recipeId: 'r-berry-boost',
  },
];

/** Ingredient stock levels (shared device hopper). */
export const stock: StockItem[] = [
  { id: 's-apple', name: 'Green Apple', level: 82, unit: 'pcs', amount: 9 },
  { id: 's-kale', name: 'Kale', level: 64, unit: 'g', amount: 320 },
  { id: 's-orange', name: 'Orange', level: 45, unit: 'pcs', amount: 5 },
  { id: 's-ginger', name: 'Ginger', level: 30, unit: 'g', amount: 60 },
  { id: 's-carrot', name: 'Carrot', level: 71, unit: 'pcs', amount: 8 },
  { id: 's-lemon', name: 'Lemon', level: 18, unit: 'pcs', amount: 2 },
  { id: 's-beet', name: 'Beetroot', level: 55, unit: 'pcs', amount: 4 },
];
