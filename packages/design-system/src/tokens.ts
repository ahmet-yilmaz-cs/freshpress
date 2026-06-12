/**
 * FreshPress design tokens — extracted from the Figma source of truth.
 * These drive both the Tailwind/NativeWind preset and the watchOS theme.
 */

export const colors = {
  // Brand — warm + vibrant cold-press palette (lively orange + fresh green)
  orange: '#ec6f15', // vivid warm orange / active states
  yellow: '#f3b733', // bright honey-gold yield-fill midpoint
  amber: '#b1521c', // rich sienna — primary CTA, headings accent
  amberPressed: '#642c0e',
  amberInk: '#642c0e',

  // Fresh accent (vibrant leaf green)
  green: '#9ed95f', // primary action surface (START JUICING)
  greenSoft: '#bdec8a', // badge background
  greenInk: '#2c6a13', // leaf-green text on green
  greenDeep: '#1f4f0d',

  // Neutrals — cream paper + warm charcoal
  ink: '#231e1a', // headings / primary text (warm charcoal)
  muted: '#5c4636', // body / secondary (warm gray-brown)
  bg: '#f5efe4', // app background (cream)
  card: '#fffdf8', // card surface (warm white)
  subtle: '#efe7d9', // inset surface
  track: '#e7dccc', // slider track / avatar bg
  border: '#ebe2d4', // hairline border
  borderWarm: '#d9bda6', // warm border
  danger: '#c0452e',
  dangerSoft: '#f6e0d4',

  white: '#ffffff',
  black: '#000000',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;

/** Type scale — name: [fontSize, lineHeight, weight, letterSpacing] */
export const typography = {
  display: { fontSize: 40, lineHeight: 48, weight: '800', letterSpacing: 0 },
  h2: { fontSize: 32, lineHeight: 40, weight: '700', letterSpacing: 0 },
  h3: { fontSize: 20, lineHeight: 28, weight: '600', letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, weight: '400', letterSpacing: 0 },
  button: { fontSize: 20, lineHeight: 28, weight: '600', letterSpacing: 0 },
  eyebrow: { fontSize: 12, lineHeight: 16, weight: '700', letterSpacing: 0.6 },
  caption: { fontSize: 10, lineHeight: 15, weight: '400', letterSpacing: 1 },
} as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export type ColorToken = keyof typeof colors;
