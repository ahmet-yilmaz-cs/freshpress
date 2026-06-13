import type { ImageSourcePropType } from 'react-native';

import type { VisualTone } from '@freshpress/types';

/**
 * Real food photography for recipes / programs. Mapped by stable id with a tone-based
 * fallback (so user-created recipes still get a sensible photo). Keeping the require()s
 * here means the shared @freshpress/data package stays free of mobile asset paths.
 */
const FOOD = {
  greenDetox: require('../../assets/food-green-detox.jpg'),
  citrus: require('../../assets/food-citrus.jpg'),
  berry: require('../../assets/food-berry.jpg'),
  tropical: require('../../assets/food-tropical.jpg'),
  beet: require('../../assets/food-beet.jpg'),
  orange: require('../../assets/food-orange.jpg'),
  watermelon: require('../../assets/food-watermelon.jpg'),
  greenPour: require('../../assets/food-green-pour.jpg'),
  berryCup: require('../../assets/food-berry-cup.jpg'),
} as const;

const BY_RECIPE: Record<string, ImageSourcePropType> = {
  'r-green-detox': FOOD.greenDetox,
  'r-citrus-burst': FOOD.citrus,
  'r-berry-boost': FOOD.berry,
  'r-tropical-sunrise': FOOD.tropical,
  'r-beet-power': FOOD.beet,
  'r-vitamin-c': FOOD.orange,
  'r-watermelon-mint': FOOD.watermelon,
};

const BY_PROGRAM: Record<string, ImageSourcePropType> = {
  'p-morning': FOOD.berryCup,
  'p-mid-detox': FOOD.greenPour,
  'p-evening': FOOD.beet,
  'p-green': FOOD.greenDetox,
  'p-vitamin-c': FOOD.orange,
};

const BY_TONE: Record<string, ImageSourcePropType> = {
  green: FOOD.greenDetox,
  orange: FOOD.orange,
  amber: FOOD.beet,
  subtle: FOOD.greenPour,
};

/** Single-subject produce photos for stock items / live ingredients. */
const PRODUCE = {
  apple: require('../../assets/ing-apple.jpg'),
  orange: require('../../assets/ing-orange.jpg'),
  carrot: require('../../assets/ing-carrot.jpg'),
  lemon: require('../../assets/ing-lemon.jpg'),
  kale: require('../../assets/ing-kale.jpg'),
  ginger: require('../../assets/ing-ginger.jpg'),
  beet: require('../../assets/ing-beet.jpg'),
  mint: require('../../assets/ing-mint.jpg'),
} as const;

const BY_INGREDIENT: Record<string, ImageSourcePropType> = {
  // Existing produce photos
  's-apple':      PRODUCE.apple,
  'ji-apple':     PRODUCE.apple,
  's-orange':     PRODUCE.orange,
  'ji-orange':    PRODUCE.orange,
  's-carrot':     PRODUCE.carrot,
  's-lemon':      PRODUCE.lemon,
  's-kale':       PRODUCE.kale,
  's-ginger':     PRODUCE.ginger,
  'ji-ginger':    PRODUCE.ginger,
  's-beet':       PRODUCE.beet,
  's-mint':       PRODUCE.mint,
  // New fruits — mapped to closest existing food photos
  's-strawberry': FOOD.berry,       // kırmızı meyveler
  's-pineapple':  FOOD.tropical,    // tropikal meyve
  's-watermelon': FOOD.watermelon,  // karpuz suyu görseli
  // New vegetables — mapped to closest existing produce photos
  's-cucumber':   PRODUCE.kale,     // yeşil, yapraklı
  's-spinach':    PRODUCE.mint,     // yeşil yaprak
  's-celery':     PRODUCE.ginger,   // açık renkli sap
};

/** Turkish ingredient-name → produce photo, for items whose id we don't recognise. */
const NAME_HINTS: ReadonlyArray<[string, ImageSourcePropType]> = [
  ['elma',       PRODUCE.apple],
  ['portakal',   PRODUCE.orange],
  ['havuç',      PRODUCE.carrot],
  ['limon',      PRODUCE.lemon],
  ['karalahana', PRODUCE.kale],
  ['zencefil',   PRODUCE.ginger],
  ['pancar',     PRODUCE.beet],
  ['nane',       PRODUCE.mint],
  ['misket',     PRODUCE.lemon],
  ['çilek',      FOOD.berry],
  ['ananas',     FOOD.tropical],
  ['karpuz',     FOOD.watermelon],
  ['salatalık',  PRODUCE.kale],
  ['ispanak',    PRODUCE.mint],
  ['kereviz',    PRODUCE.ginger],
];

/** Photo for a recipe (by id, then tone, then a neutral juice fallback). */
export function recipeImage(id?: string, tone?: VisualTone): ImageSourcePropType {
  return (id && BY_RECIPE[id]) || (tone && BY_TONE[tone]) || FOOD.greenPour;
}

/** Photo for a quick program (by id, then tone, then a neutral juice fallback). */
export function programImage(id?: string, tone?: VisualTone): ImageSourcePropType {
  return (id && BY_PROGRAM[id]) || (tone && BY_TONE[tone]) || FOOD.greenPour;
}

/** Produce photo for a stock item / live ingredient (by id, then name, then tone). */
export function ingredientImage(
  id?: string,
  name?: string,
  tone?: VisualTone,
): ImageSourcePropType {
  if (id && BY_INGREDIENT[id]) return BY_INGREDIENT[id];
  const lower = (name ?? '').toLowerCase();
  for (const [hint, img] of NAME_HINTS) if (lower.includes(hint)) return img;
  return (tone && BY_TONE[tone]) || FOOD.greenPour;
}
