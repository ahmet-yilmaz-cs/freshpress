/**
 * FreshPress design tokens — extracted from the Figma source of truth.
 * These drive both the Tailwind/NativeWind preset and the watchOS theme.
 */

export const colors = {
  // Brand
  orange: '#ff8200', // primary brand / active states
  amber: '#954a00', // deep brand — primary CTA, headings accent
  amberPressed: '#5f2c00',
  amberInk: '#5f2d01',

  // Fresh accent (juice green)
  green: '#91f68d', // primary action surface (START JUICING)
  greenSoft: '#94f990', // badge background
  greenInk: '#00721e', // text on green
  greenDeep: '#005313',

  // Neutrals
  ink: '#1a1c1c', // headings / primary text
  muted: '#574235', // body / secondary (warm gray-brown)
  bg: '#f9f9f9', // app background
  card: '#ffffff', // card surface
  subtle: '#f3f3f4', // inset surface
  track: '#e2e2e2', // slider track / avatar bg
  border: '#eeeeee', // hairline border
  borderWarm: '#dec1af', // warm border

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
  display: { fontSize: 40, lineHeight: 48, weight: '800', letterSpacing: -1 },
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
